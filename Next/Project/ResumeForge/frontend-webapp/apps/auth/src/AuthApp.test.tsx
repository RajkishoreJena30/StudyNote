import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthApp from './AuthApp';

describe('AuthApp', () => {
  it('shows validation errors for an invalid email and short password', () => {
    render(<AuthApp />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('accepts valid credentials', () => {
    render(<AuthApp />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'me@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'longenough' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
