// Centralized Kafka topic names. Keeping them in one place avoids typos and
// makes the event contract between services explicit (LLD: event catalog).
export const KAFKA_TOPICS = {
  // Booking SAGA lifecycle
  BOOKING_CREATED: 'booking.created',
  SEAT_RESERVED: 'booking.seat-reserved',
  SEAT_RESERVATION_FAILED: 'booking.seat-reservation-failed',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_CANCELLED: 'booking.cancelled',

  // Payment SAGA steps
  PAYMENT_REQUESTED: 'payment.requested',
  PAYMENT_SUCCEEDED: 'payment.succeeded',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_REFUNDED: 'payment.refunded',

  // Catalog -> Search index sync
  PRODUCT_UPSERTED: 'catalog.product-upserted',
  PRODUCT_DELETED: 'catalog.product-deleted',

  // User domain
  USER_REGISTERED: 'user.registered',

  // Dead-letter queue (fault tolerance)
  DLQ: 'ecom.dlq',
} as const;

export type KafkaTopic = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];

// Consumer group ids (one durable group per service for at-least-once delivery)
export const CONSUMER_GROUPS = {
  BOOKING: 'booking-service-group',
  PAYMENT: 'payment-service-group',
  SEARCH: 'search-service-group',
  USER: 'user-service-group',
} as const;
