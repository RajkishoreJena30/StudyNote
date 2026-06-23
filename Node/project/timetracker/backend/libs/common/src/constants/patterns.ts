/**
 * Message patterns exchanged over TCP between the API gateway and microservices.
 * Keep these stable — they form the contract between services.
 */
export const AUTH_PATTERNS = {
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  REFRESH: 'auth.refresh',
  LOGOUT: 'auth.logout',
  GET_PROFILE: 'auth.get_profile',
  UPDATE_PROFILE: 'auth.update_profile',
} as const;

export const SUBSCRIPTION_PATTERNS = {
  LIST_PLANS: 'subscription.list_plans',
  SUBSCRIBE: 'subscription.subscribe',
  GET_MY_SUBSCRIPTION: 'subscription.get_mine',
  CANCEL: 'subscription.cancel',
} as const;

export const TASK_PATTERNS = {
  CREATE: 'task.create',
  LIST: 'task.list',
  GET: 'task.get',
  UPDATE: 'task.update',
  DELETE: 'task.delete',
} as const;

export const TIME_PATTERNS = {
  START: 'time.start',
  STOP: 'time.stop',
  CREATE: 'time.create',
  LIST: 'time.list',
  ACTIVE: 'time.active',
  SUMMARY: 'time.summary',
  DELETE: 'time.delete',
} as const;

export const GOAL_PATTERNS = {
  CREATE: 'goal.create',
  LIST: 'goal.list',
  GET: 'goal.get',
  UPDATE: 'goal.update',
  DELETE: 'goal.delete',
  LOG_PROGRESS: 'goal.log_progress',
  CONSISTENCY: 'goal.consistency',
} as const;
