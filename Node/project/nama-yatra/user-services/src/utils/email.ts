import { config } from "../config/env";
import sgMial from "@sendgrid/mail";

sgMial.setApiKey(config.SENDGRID_API_KEY);

const minutes = ( config.MINUTES_TO_EXPIRE || 300 ) /60;

async function sendEmail(to: string, subject: string, text: string) {
    const msg = {
        to,
        from: `${config.MAIL_FROM}`,
        subject:" Your Nama Yatra Authentication request ",
        html: `<p>${text}</p><p>This link will expire in ${minutes} hours.</p>`
    }
}
