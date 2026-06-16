// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface RegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyOtpRequestBody {
    otpSessionId: string;
    otp: string;
}

// ─── OTP / Redis ──────────────────────────────────────────────────────────────

export interface OtpMeta {
    firstName: string;
    lastName: string;
    email: string;
    password: string; // already hashed before storing
}

export interface OtpSessionData {
    meta: OtpMeta;
    hashed: string; // HMAC of email:otp
}

// ─── Service Results ──────────────────────────────────────────────────────────

export interface SendOtpResult {
    otpSessionId: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = undefined> {
    status: boolean;
    message: string;
    data?: T;
}
