import { config } from "../config/env";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

const minutes = ( config.MINUTES_TO_EXPIRE || 300 ) / 60;

async function sendOtpEmail(to: string, otp: string) {
    const msg = {
        to,
        from: `${config.MAIL_FROM}`,
        subject: " Your Nama Yatra Authentication request ",
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in ${minutes} hours.</p>`
    };
    await transporter.sendMail(msg);
}

async function verifyOtpEmail(to: string, otp: string) {
    const msg = {
        to,
        from: `${config.MAIL_FROM}`,
        subject: " Your Nama Yatra OTP Verified, Welcome to Nama Yatra ",
        html: `<p>Your OTP ${otp} has been successfully verified.</p><p>If you did not request this, please contact support immediately.</p>`
    };
    await transporter.sendMail(msg);
}

export { sendOtpEmail, verifyOtpEmail };