import { type Request, type Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError } from '@/utils/error';
import { authService } from '../services/auth.service';
import { config } from '../config/env';
import type { RegisterRequestBody } from '../types/index';

const requestOtp = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, confirmPassword } = req.body as RegisterRequestBody;

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
        throw new BadRequestError("All fields are required");
    }

    if (password !== confirmPassword) {
        throw new BadRequestError("Password and Confirm Password do not match");
    }

    const { otpSessionId } = await authService.sendOtpEmail(firstName, lastName, email, password);

    res.cookie("otpSessionId", otpSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.MINUTES_TO_EXPIRE * 1000,
    }).status(200).json({ status: true, message: "OTP sent to email" });
};

export const authController = {
    sendOtpEmail: asyncHandler(requestOtp),
};