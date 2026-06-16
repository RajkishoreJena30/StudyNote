/**
 * Adapter Design Pattern — the common contract every payment provider must
 * implement. The PaymentsService depends ONLY on this interface, so adding a
 * new provider never touches business logic (Open/Closed Principle).
 *
 * See LLD: "Multiple Payment Gateway Integration using Adapter Pattern".
 */
export interface ChargeInput {
  amount: number;
  currency: string;
  reference: string; // bookingId
}

export interface GatewayChargeResult {
  providerRef: string;
  status: 'SUCCEEDED' | 'FAILED';
  reason?: string;
}

export interface PaymentGateway {
  /** Unique provider key, e.g. "stripe". */
  readonly name: string;
  charge(input: ChargeInput): Promise<GatewayChargeResult>;
  refund(providerRef: string): Promise<void>;
}

export const PAYMENT_GATEWAYS = 'PAYMENT_GATEWAYS';
