import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BillingInterval, Plan, Subscription } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from '@app/prisma';
import {
  CancelPayload,
  GetMySubscriptionPayload,
  SubscribePayload,
} from './subscription.types';

const PLANS_CACHE_KEY = 'plans:active';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async listPlans(): Promise<Plan[]> {
    const cached = await this.cache.get<Plan[]>(PLANS_CACHE_KEY);
    if (cached) {
      return cached;
    }

    const plans = await this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { priceCents: 'asc' },
    });
    await this.cache.set(PLANS_CACHE_KEY, plans);
    return plans;
  }

  async subscribe(dto: SubscribePayload): Promise<Subscription> {
    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });
    if (!plan || !plan.isActive) {
      throw new NotFoundException('Subscription plan not found');
    }

    const now = new Date();
    const currentPeriodEnd = this.computePeriodEnd(now, plan.interval);

    // A user has at most one live subscription: cancel any existing ones first.
    return this.prisma.$transaction(async (tx) => {
      await tx.subscription.updateMany({
        where: { userId: dto.userId, status: 'ACTIVE' },
        data: { status: 'CANCELED', cancelAtPeriodEnd: true },
      });

      return tx.subscription.create({
        data: {
          userId: dto.userId,
          planId: plan.id,
          status: 'ACTIVE',
          currentPeriodStart: now,
          currentPeriodEnd,
        },
        include: { plan: true },
      });
    });
  }

  async getMine(dto: GetMySubscriptionPayload): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: { userId: dto.userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
  }

  async cancel(dto: CancelPayload): Promise<Subscription> {
    const active = await this.prisma.subscription.findFirst({
      where: { userId: dto.userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    if (!active) {
      throw new NotFoundException('No active subscription to cancel');
    }

    return this.prisma.subscription.update({
      where: { id: active.id },
      data: { cancelAtPeriodEnd: true },
      include: { plan: true },
    });
  }

  private computePeriodEnd(start: Date, interval: BillingInterval): Date {
    const end = new Date(start);
    if (interval === BillingInterval.YEAR) {
      end.setFullYear(end.getFullYear() + 1);
    } else {
      end.setMonth(end.getMonth() + 1);
    }
    return end;
  }
}
