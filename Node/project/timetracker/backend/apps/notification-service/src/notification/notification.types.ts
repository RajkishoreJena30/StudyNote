export interface ListNotificationsPayload {
  userId: string;
}

export interface CreateNotificationPayload {
  userId: string;
  title: string;
  body: string;
}