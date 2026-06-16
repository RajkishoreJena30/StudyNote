// import { config } from "../config/env";
// import sgMial from "@sendgrid/mail";

// sgMial.setApiKey(config.SENDGRID_API_KEY);

// const minutes = ( config.MINUTES_TO_EXPIRE || 300 ) /60;

// // async function sendEmail(to: string, subject: string, text: string) {
// //     const msg = {
// //         to,
// //         from: `${config.MAIL_FROM}`,
// //         subject:" Your Nama Yatra Authentication request ",
// //         html: `<p>${text}</p><p>This link will expire in ${minutes} hours.</p>`
// //     }
// // }

// async function sendOtpEmail(to: string, otp: string) {
//     const msg = {
//         to,
//         from: `${config.MAIL_FROM}`,
//         subject:" Your Nama Yatra Authentication request ",
//         html: `<p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in ${minutes} hours.</p>`
//     }
// }

// async function verifyOtpEmail(to: string, otp: string) {
//     const msg = {
//         to,
//         from: `${config.MAIL_FROM}`,
//         subject:" Your Nama Yatra OTP Verified, Welcome to Nama Yatra ",
//         html: `<p>Your OTP ${otp} has been successfully verified.</p><p>If you did not request this, please contact support immediately.</p>`
//     }
// }