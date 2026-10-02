import nodemailer from "nodemailer";
import { env } from "./env";

type Transporter = ReturnType<typeof nodemailer.createTransport>;

let transport: Transporter | null = null;

export function getTransport(): Transporter {
  if (!transport) {
    transport = nodemailer.createTransport(env.smtpUrl);
  }
  return transport;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<void> {
  await getTransport().sendMail({
    from: env.mailFrom,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
