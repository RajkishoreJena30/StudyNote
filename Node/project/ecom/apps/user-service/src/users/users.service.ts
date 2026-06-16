import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { KAFKA_TOPICS, KafkaProducerService } from '@app/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaProducerService,
  ) {}

  // NOTE: demo hashing only. Use bcrypt/argon2 in real code.
  private hash(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: this.hash(dto.password),
      },
    });

    // Publish domain event (async fan-out: analytics, welcome email, etc.)
    await this.kafka.emit(KAFKA_TOPICS.USER_REGISTERED, user.id, {
      eventId: randomUUID(),
      correlationId: user.id,
      occurredAt: new Date().toISOString(),
      userId: user.id,
      email: user.email,
    });

    return this.toPublic(user);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  private toPublic(user: { id: string; email: string; name: string }) {
    return { id: user.id, email: user.email, name: user.name };
  }
}
