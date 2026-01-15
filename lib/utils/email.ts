// src/lib/utils/email.ts
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import * as React from "react";

// Email Templates
import { VerificationEmail } from "../../emails/verification";
import { ResetPasswordEmail } from "../../emails/reset-password";
import { TutorInvitationEmail } from "../../emails/tutor-invitation";
import { InstitutionVerificationEmail } from "../../emails/institution-verification";
import { StudentOTPEmail } from "../../emails/student-otp";
import { LeadReplyEmail } from "../../emails/lead-reply";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// NODEMAILER TRANSPORTER
// ============================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@brainy.app";
const FROM_NAME = process.env.SMTP_FROM_NAME || "Brainy";

// ============================================
// HELPERS
// ============================================

async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string;
  subject: string;
  template: React.ReactElement;
}) {
  const html = await render(template);
  
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to} with subject "${subject}":`, error);
    throw new Error("Failed to send email");
  }
}

// ============================================
// EXPORTED ACTIONS
// ============================================

export async function sendTutorInvitationEmail(
  email: string,
  token: string,
  institutionName: string,
  inviterName: string,
  customMessage?: string
): Promise<void> {
  const invitationUrl = `${APP_URL}/invitations/${token}`;
  
  await sendEmail({
    to: email,
    subject: `You're invited to be a tutor at ${institutionName}`,
    template: React.createElement(TutorInvitationEmail, {
      url: invitationUrl,
      institutionName,
      inviterName,
      customMessage,
    }),
  });
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  redirectPath: string = "/dashboard"
): Promise<void> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}&redirectTo=${encodeURIComponent(
    redirectPath
  )}`;

  await sendEmail({
    to: email,
    subject: "Verify your email - Brainy",
    template: React.createElement(VerificationEmail, { url: verificationUrl }),
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password - Brainy",
    template: React.createElement(ResetPasswordEmail, { url: resetUrl }),
  });
}

export async function sendInstitutionVerificationEmail(
  email: string,
  token: string,
  institutionName: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/onboarding/institution/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: `Verify ${institutionName} - Brainy`,
    template: React.createElement(InstitutionVerificationEmail, {
      url: verificationUrl,
      institutionName,
    }),
  });
}

export async function sendStudentVerificationOTP(
  email: string,
  otp: string,
  institutionName: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Verify your student email - Brainy",
    template: React.createElement(StudentOTPEmail, {
      otp,
      institutionName,
    }),
  });
}

export async function sendLeadReplyEmail(
  email: string,
  name: string,
  subject: string,
  replyContent: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `RE: ${subject || "Your Inquiry"}`,
    template: React.createElement(LeadReplyEmail, {
      name,
      content: replyContent,
    }),
  });
}
