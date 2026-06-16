import prisma from '../config/prisma';
import { ConflictError } from '../utils/error';
import bcrypt from 'bcrypt';
import { generateAndStoreOtp } from '../utils/otp';
import { sendOtpEmail } from '../utils/email';
import type { OtpMeta, SendOtpResult } from '../types/index';

async function sendOtpEmailService(
    firstName: string,
    lastName: string,
    email: string,
    password: string
): Promise<SendOtpResult> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const meta: OtpMeta = { firstName, lastName, email, password: hashedPassword };
    const { otp, otpSessionId } = await generateAndStoreOtp(meta);
    await sendOtpEmail(email, otp);

    return { otpSessionId };
}

export const authService = {
    sendOtpEmail: sendOtpEmailService,
};