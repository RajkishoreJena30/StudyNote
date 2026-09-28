import { useState, type FormEvent } from 'react';
import { Button } from '@resumeforge/ui';
import { validateCredentials, type CredentialErrors } from './lib/validation';
// Imported here (not bootstrap.tsx) so the CSS ships with the federated module the shell actually loads.
import '@resumeforge/ui/tokens.css';
import '@resumeforge/ui/tailwind.css';

// The ONLY file exposed via Module Federation (see exposes './AuthApp' in rspack.config.mjs).
export default function AuthApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<CredentialErrors>({});
  const [status, setStatus] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validateCredentials({ email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    // Real sign-in is OIDC/PKCE via the BFF (plan/07-Security-Auth.md); not wired yet.
    setStatus('Sign-in service is not connected yet.');
  }

  return (
    <section className="rf-card" style={{ maxWidth: '28rem' }}>
      <h1>Welcome back</h1>
      <p className="rf-muted">This component is federated from http://localhost:3003.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="rf-field">
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="rf-input"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'auth-email-error' : undefined}
          />
          {errors.email && (
            <span id="auth-email-error" role="alert" style={{ color: 'var(--rf-danger)' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="rf-field">
          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="rf-input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? 'auth-password-error' : undefined}
          />
          {errors.password && (
            <span id="auth-password-error" role="alert" style={{ color: 'var(--rf-danger)' }}>
              {errors.password}
            </span>
          )}
        </div>

        <Button type="submit" className="rf-btn--primary" style={{ width: '100%' }}>
          Sign in
        </Button>
      </form>

      <p className="rf-row rf-mt" style={{ justifyContent: 'center' }}>
        <span className="rf-muted">or</span>
      </p>
      <Button type="button" style={{ width: '100%' }} disabled>
        Continue with Google (OIDC)
      </Button>

      {status && (
        <p className="rf-muted rf-mt" role="status">
          {status}
        </p>
      )}
    </section>
  );
}
