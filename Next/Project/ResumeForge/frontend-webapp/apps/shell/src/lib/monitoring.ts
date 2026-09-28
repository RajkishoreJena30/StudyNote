import * as Sentry from '@sentry/react';
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

export function initMonitoring() {
  if (__SENTRY_DSN__) {
    Sentry.init({
      dsn: __SENTRY_DSN__,
      environment: __APP_ENV__,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.1,
    });
  }

  const report = (metric: Metric) => {
    if (__APP_ENV__ === 'development') console.debug('[web-vitals]', metric.name, metric.value);
  };
  onCLS(report);
  onINP(report);
  onLCP(report);
}
