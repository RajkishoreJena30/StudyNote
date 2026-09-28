const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface Credentials {
  email: string;
  password: string;
}

export type CredentialErrors = Partial<Record<keyof Credentials, string>>;

export function validateCredentials({ email, password }: Credentials): CredentialErrors {
  const errors: CredentialErrors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}
