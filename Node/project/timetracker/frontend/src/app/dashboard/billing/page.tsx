'use client';

import { Badge, Button, Card } from '@/components/ui';
import { apiErrorMessage } from '@/lib/api-client';
import { formatPrice } from '@/lib/format';
import { useMySubscription, usePlans, useSubscribe } from '@/lib/hooks';

export default function BillingPage() {
  const { data: plans } = usePlans();
  const { data: subscription } = useMySubscription();
  const subscribe = useSubscribe();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Billing &amp; Plans</h1>
        <p className="text-slate-400">
          Upgrade to unlock unlimited tasks, goals and focus insights.
        </p>
      </header>

      {subscription && (
        <Card className="border-indigo-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Current plan</p>
              <p className="text-xl font-semibold">
                {subscription.plan?.name ?? 'Active plan'}
              </p>
              <p className="text-xs text-slate-500">
                Renews{' '}
                {new Date(
                  subscription.currentPeriodEnd,
                ).toLocaleDateString()}
                {subscription.cancelAtPeriodEnd && ' · cancels at period end'}
              </p>
            </div>
            <Badge tone="success">{subscription.status}</Badge>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {plans?.map((plan) => {
          const current = subscription?.planId === plan.id;
          return (
            <Card key={plan.id} className="flex flex-col">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold">
                {formatPrice(plan.priceCents)}
                <span className="text-sm font-normal text-slate-500">
                  {plan.priceCents > 0 && `/${plan.interval.toLowerCase()}`}
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={current ? 'outline' : 'primary'}
                disabled={current || subscribe.isPending}
                onClick={() =>
                  subscribe.mutate(plan.id, {
                    onError: (e) => alert(apiErrorMessage(e)),
                  })
                }
              >
                {current ? 'Current plan' : `Choose ${plan.name}`}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
