import { BillingInterval, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding subscription plans...');

  const plans = [
    {
      code: 'free',
      name: 'Free',
      description: 'Get started with the essentials.',
      priceCents: 0,
      interval: BillingInterval.MONTH,
      features: [
        'Up to 10 active tasks',
        'Basic time tracking',
        '1 active goal',
      ],
    },
    {
      code: 'pro_monthly',
      name: 'Pro',
      description: 'For focused professionals who want to stay consistent.',
      priceCents: 900,
      interval: BillingInterval.MONTH,
      features: [
        'Unlimited tasks',
        'Advanced time tracking & reports',
        'Unlimited goals & streaks',
        'Focus insights',
      ],
    },
    {
      code: 'pro_yearly',
      name: 'Pro (Yearly)',
      description: 'Save 2 months with annual billing.',
      priceCents: 9000,
      interval: BillingInterval.YEAR,
      features: [
        'Everything in Pro',
        '2 months free',
        'Priority support',
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  console.log(`Seeded ${plans.length} plans.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
