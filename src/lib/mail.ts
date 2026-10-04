import nodemailer from "nodemailer";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { env } from "./env";

type Transporter = ReturnType<typeof nodemailer.createTransport>;

const driver = process.env.MAIL_DRIVER ?? "smtp";
let smtp: Transporter | null = null;
let ses: SESClient | null = null;

function getSmtp(): Transporter {
  if (!smtp) smtp = nodemailer.createTransport(env.smtpUrl);
  return smtp;
}

function getSes(): SESClient {
  if (!ses) ses = new SESClient({ region: process.env.AWS_REGION ?? "af-south-1" });
  return ses;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<void> {
  if (driver === "ses") {
    await getSes().send(
      new SendEmailCommand({
        Source: env.mailFrom,
        Destination: { ToAddresses: [opts.to] },
        Message: {
          Subject: { Data: opts.subject },
          Body: {
            Text: opts.text ? { Data: opts.text } : undefined,
            Html: opts.html ? { Data: opts.html } : undefined,
          },
        },
      }),
    );
    return;
  }
  await getSmtp().sendMail({
    from: env.mailFrom,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
