// Strongly-typed event payloads exchanged over Kafka.
// Every event carries a correlationId so the SAGA + tracing can stitch the flow.

export interface BaseEvent {
  eventId: string;
  correlationId: string; // SAGA / booking id
  occurredAt: string; // ISO timestamp
}

export interface BookingCreatedEvent extends BaseEvent {
  bookingId: string;
  userId: string;
  eventInventoryId: string; // e.g. show / flight / event
  seatIds: string[];
  amount: number;
  currency: string;
}

export interface SeatReservedEvent extends BaseEvent {
  bookingId: string;
  seatIds: string[];
}

export interface SeatReservationFailedEvent extends BaseEvent {
  bookingId: string;
  reason: string;
}

export interface PaymentRequestedEvent extends BaseEvent {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string; // stripe | razorpay | paypal
}

export interface PaymentResultEvent extends BaseEvent {
  bookingId: string;
  paymentId: string;
  status: 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  reason?: string;
}

export interface ProductUpsertedEvent extends BaseEvent {
  productId: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
}
