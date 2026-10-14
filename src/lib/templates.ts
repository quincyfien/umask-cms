export function emailWrapper(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f1f5f9; margin: 0; padding: 32px 16px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #111c33; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0d3b66, #001220); padding: 32px; border-bottom: 2px solid #20a39e; text-align: center; }
    .logo { font-size: 20px; font-weight: 800; letter-spacing: 0.1em; color: #20a39e; text-transform: uppercase; font-family: Georgia, serif; }
    .content { padding: 32px; font-size: 15px; line-height: 1.6; color: #cbd5e1; }
    .footer { padding: 24px 32px; background-color: #0a1122; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center; }
    .btn { display: inline-block; background-color: #20a39e; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 20px 0; }
    .card { background-color: #17233f; border-left: 4px solid #20a39e; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">UNMASK</div>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} UNMASK. All rights reserved.</p>
      <p>This is an automated notification. If you did not request this, please disregard.</p>
    </div>
  </div>
</body>
</html>`;
}

export function applicationStatusTemplate(
  fullName: string,
  programTitle: string,
  reference: string,
  status: "ACCEPTED" | "REJECTED" | "UNDER_REVIEW",
  reviewNotes?: string | null
): { subject: string; text: string; html: string } {
  let statusText = "";
  let messageBody = "";

  if (status === "ACCEPTED") {
    statusText = "Application Accepted";
    messageBody = `
      <h2 style="color: #20a39e; margin-top: 0;">Congratulations, ${fullName}!</h2>
      <p>We are pleased to inform you that your application for <strong>${programTitle}</strong> has been <strong>ACCEPTED</strong>.</p>
      <div class="card">
        <p style="margin: 0;"><strong>Reference Identifier:</strong> ${reference}</p>
        ${reviewNotes ? `<p style="margin-top: 10px; margin-bottom: 0;"><strong>Review Committee Feedback:</strong><br>${reviewNotes}</p>` : ""}
      </div>
      <p>Our program administration will reach out shortly with onboarding materials and schedule details.</p>
    `;
  } else if (status === "REJECTED") {
    statusText = "Application Status Update";
    messageBody = `
      <h2 style="color: #f87171; margin-top: 0;">Dear ${fullName},</h2>
      <p>Thank you for submitting your application to <strong>${programTitle}</strong> (Ref: <code>${reference}</code>).</p>
      <p>After thorough review by our evaluation committee, we regret to inform you that we are unable to offer you a position at this time due to intense competition and seat constraints.</p>
      ${reviewNotes ? `<div class="card"><p style="margin: 0;"><strong>Committee Notes:</strong><br>${reviewNotes}</p></div>` : ""}
      <p>We encourage you to follow future opportunities and research cohorts published at UNMASK.</p>
    `;
  } else {
    statusText = "Application Under Review";
    messageBody = `
      <h2 style="color: #60a5fa; margin-top: 0;">Dear ${fullName},</h2>
      <p>Your application to <strong>${programTitle}</strong> (Ref: <code>${reference}</code>) is currently <strong>Under Review</strong> by our scientific panel.</p>
      <p>We will notify you once a final decision has been rendered.</p>
    `;
  }

  const subject = `UNMASK: ${statusText} — ${programTitle}`;
  const text = `Dear ${fullName},\n\nYour application for "${programTitle}" (Reference: ${reference}) status is: ${status}.\n\n${reviewNotes ? `Notes: ${reviewNotes}\n\n` : ""}UNMASK`;
  const html = emailWrapper(subject, messageBody);

  return { subject, text, html };
}

export function eventReminderTemplate(
  attendeeName: string,
  eventTitle: string,
  eventDate: string,
  locationOrLink: string,
  hoursUntil: number
): { subject: string; text: string; html: string } {
  const subject = `Reminder: "${eventTitle}" begins in ${hoursUntil === 48 ? "48 hours" : "3 hours"}`;
  const body = `
    <h2 style="color: #20a39e; margin-top: 0;">Event Reminder</h2>
    <p>Dear ${attendeeName},</p>
    <p>This is an automated reminder that your scheduled session for <strong>${eventTitle}</strong> is taking place in <strong>${hoursUntil === 48 ? "two days" : "three hours"}</strong>.</p>
    <div class="card">
      <p style="margin: 0 0 8px 0;"><strong>Event:</strong> ${eventTitle}</p>
      <p style="margin: 0 0 8px 0;"><strong>Date & Time:</strong> ${eventDate}</p>
      <p style="margin: 0;"><strong>Access / Venue:</strong> ${locationOrLink}</p>
    </div>
    <p>We look forward to your participation.</p>
  `;

  const text = `Dear ${attendeeName},\n\nReminder: "${eventTitle}" begins in ${hoursUntil} hours.\nDate: ${eventDate}\nLocation: ${locationOrLink}\n\nUNMASK`;
  const html = emailWrapper(subject, body);

  return { subject, text, html };
}
