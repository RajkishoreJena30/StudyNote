export interface SubscribePayload {
  userId: string;
  planId: string;
}

export interface GetMySubscriptionPayload {
  userId: string;
}

export interface CancelPayload {
  userId: string;
}
