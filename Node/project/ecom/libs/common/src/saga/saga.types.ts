/**
 * Minimal SAGA building blocks for orchestration-based distributed transactions.
 *
 * Each step has an `invoke` (forward action) and a `compensate` (undo action).
 * The orchestrator runs steps in order; if any step throws, it runs the
 * compensations for all already-completed steps in reverse order.
 *
 * See LLD: "Distributed Transactions using SAGA Pattern".
 */
export interface SagaStep<TContext> {
  name: string;
  invoke: (ctx: TContext) => Promise<void>;
  compensate: (ctx: TContext) => Promise<void>;
}

export enum SagaState {
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  FAILED = 'FAILED',
}

export interface SagaResult {
  state: SagaState;
  completedSteps: string[];
  error?: string;
}
