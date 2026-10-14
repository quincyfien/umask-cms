export const env = {
  siteOrigin: process.env.SITE_ORIGIN ?? "http://localhost:3000",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me",
  mailTransport: process.env.MAIL_TRANSPORT ?? "smtp",
  smtpUrl: process.env.SMTP_URL ?? "smtp://localhost:1025",
  mailFrom: process.env.MAIL_FROM ?? "noreply@btrc-center.org",
  uploadDir: process.env.UPLOAD_DIR ?? "./uploads",
  isProduction: process.env.NODE_ENV === "production",
  sessionIdleSeconds: 8 * 60 * 60,
  sessionAbsoluteSeconds: 24 * 60 * 60,
};
