import otpGenerator from "otp-generator";
import crypto from "crypto";
import { TooManyRequestError } from "./error";
import redis from "../config/redis";
import { config } from "../config/env";
import type { OtpMeta, OtpSessionData } from "../types/index";

const RATE_MAX = parseInt(config.OTP_RATE_MAX, 10);
const HASH_SECRET = config.OTP_HASH_SECRET;
const OTP_EXPIRATION = 300; // 5 minutes

function hmacFor(email: string, otp: string): string {
    return crypto.createHmac("sha256", HASH_SECRET).update(`${email}:${otp}`).digest("hex");
}

export async function generateAndStoreOtp(
    meta: OtpMeta
): Promise<{ otpSessionId: string; otp: string }> {
    const rateKey = `otp:rate:${meta.email}`;
    const sendCount = parseInt((await redis.get(rateKey)) ?? "0", 10);

    if (sendCount >= RATE_MAX) {
        throw new TooManyRequestError("Too many OTP requests. Please try again later.");
    }

    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
    });
    const otpSessionId = crypto.randomUUID();
    const hashed = hmacFor(meta.email, otp);

    const sessionData: OtpSessionData = { meta, hashed };
    await redis.set(`otp:session:${otpSessionId}`, JSON.stringify(sessionData), "EX", OTP_EXPIRATION);

    await redis.incr(rateKey);
    await redis.expire(rateKey, 3600); // reset rate limit after 1 hour

    return { otpSessionId, otp };
}