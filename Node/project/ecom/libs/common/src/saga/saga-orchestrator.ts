import { Logger } from '@nestjs/common';
import { SagaResult, SagaState, SagaStep } from './saga.types';

/**
 * Orchestration SAGA runner.
 *
 * Usage:
 *   const saga = new SagaOrchestrator<MyCtx>('booking', logger)
 *     .addStep({ name: 'reserveSeats', invoke, compensate })
 *     .addStep({ name: 'charge', invoke, compensate });
 *   const result = await saga.execute(ctx);
 *
 * Guarantees:
 *  - forward steps run in order
 *  - on failure, completed steps are compensated in reverse (best-effort)
 *  - compensation failures are logged but do not stop the rollback chain
 */
export class SagaOrchestrator<TContext> {
  private readonly steps: SagaStep<TContext>[] = [];

  constructor(
    private readonly name: string,
    private readonly logger: Logger = new Logger(SagaOrchestrator.name),
  ) {}

  addStep(step: SagaStep<TContext>): this {
    this.steps.push(step);
    return this;
  }

  async execute(ctx: TContext): Promise<SagaResult> {
    const completed: SagaStep<TContext>[] = [];
    this.logger.log(`SAGA "${this.name}" started`);

    for (const step of this.steps) {
      try {
        this.logger.debug(`[${this.name}] -> ${step.name}`);
        await step.invoke(ctx);
        completed.push(step);
      } catch (err) {
        const message = (err as Error).message;
        this.logger.error(`[${this.name}] step "${step.name}" failed: ${message}`);
        await this.compensate(ctx, completed);
        return {
          state: SagaState.COMPENSATED,
          completedSteps: completed.map((s) => s.name),
          error: message,
        };
      }
    }

    this.logger.log(`SAGA "${this.name}" completed`);
    return {
      state: SagaState.COMPLETED,
      completedSteps: completed.map((s) => s.name),
    };
  }

  private async compensate(
    ctx: TContext,
    completed: SagaStep<TContext>[],
  ): Promise<void> {
    this.logger.warn(`[${this.name}] compensating ${completed.length} step(s)`);
    for (const step of [...completed].reverse()) {
      try {
        await step.compensate(ctx);
        this.logger.debug(`[${this.name}] compensated ${step.name}`);
      } catch (err) {
        // Best-effort: log and continue so other compensations still run.
        this.logger.error(
          `[${this.name}] compensation for "${step.name}" failed: ${(err as Error).message}`,
        );
      }
    }
  }
}
