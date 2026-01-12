// src/lib/utils/email.ts
import nodemailer from "nodemailer";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// NODEMAILER TRANSPORTER
// ============================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@brainy.app";
const FROM_NAME = process.env.SMTP_FROM_NAME || "Brainy";

// ============================================
// TUTOR INVITATION
// ============================================

export async function sendTutorInvitationEmail(
  email: string,
  token: string,
  institutionName: string,
  inviterName: string,
  customMessage?: string
): Promise<void> {
  const invitationUrl = `${APP_URL}/invitations/${token}`;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `You're invited to be a tutor at ${institutionName} - Brainy`,
      html: getTutorInvitationEmailTemplate(
        invitationUrl,
        institutionName,
        inviterName,
        customMessage
      ),
    });
  } catch (error) {
    console.error("Failed to send tutor invitation email:", error);
    throw new Error("Failed to send tutor invitation email");
  }
}

// ============================================
// EMAIL VERIFICATION
// ============================================

export async function sendVerificationEmail(
  email: string,
  token: string,
  redirectPath: string = "/dashboard"
): Promise<void> {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}&redirectTo=${encodeURIComponent(
    redirectPath
  )}`;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: "Verify your email - Brainy",
      html: getVerificationEmailTemplate(verificationUrl),
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}


// ============================================
// PASSWORD RESET
// ============================================

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: "Reset your password - Brainy",
      html: getPasswordResetEmailTemplate(resetUrl),
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

// ============================================
// INSTITUTION VERIFICATION
// ============================================

export async function sendInstitutionVerificationEmail(
  email: string,
  token: string,
  institutionName: string
): Promise<void> {
  const verificationUrl = `${APP_URL}/onboarding/institution/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `Verify ${institutionName} - Brainy`,
      html: getInstitutionVerificationEmailTemplate(verificationUrl, institutionName),
    });
  } catch (error) {
    console.error("Failed to send institution verification email:", error);
    throw new Error("Failed to send institution verification email");
  }
}

// ============================================
// STUDENT VERIFICATION (OTP)
// ============================================

export async function sendStudentVerificationOTP(
  email: string,
  otp: string,
  institutionName: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: "Verify your student email - Brainy",
      html: getStudentVerificationOTPTemplate(otp, institutionName),
    });
  } catch (error) {
    console.error("Failed to send student verification OTP:", error);
    throw new Error("Failed to send student verification OTP");
  }
}

// ============================================
// EMAIL TEMPLATES
// ============================================

function getTutorInvitationEmailTemplate(
  invitationUrl: string,
  institutionName: string,
  inviterName: string,
  customMessage?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tutor Invitation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited! 🎓</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Join ${institutionName} as a Tutor</h2>
          
          <p style="color: #666; font-size: 16px;">
            <strong>${inviterName}</strong> has invited you to join <strong>${institutionName}</strong> 
            as a tutor on Brainy's platform.
          </p>
          
          ${customMessage ? `
          <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 0; color: #666; font-style: italic;">"${customMessage}"</p>
          </div>
          ` : ''}
          
          <p style="color: #666; font-size: 16px;">
            As a tutor, you'll be able to:
          </p>
          
          <ul style="color: #666;">
            <li>Create and manage courses</li>
            <li>Design quizzes and assessments</li>
            <li>Track student performance</li>
            <li>Generate analytics and insights</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;
                      font-weight: 600;
                      font-size: 16px;">
              Accept Invitation
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${invitationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getVerificationEmailTemplate(verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Brainy! 🧠</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
          
          <p style="color: #666; font-size: 16px;">
            Thank you for signing up! Please click the button below to verify your email address and activate your account.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;
                      font-weight: 600;
                      font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getPasswordResetEmailTemplate(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request 🔒</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          
          <p style="color: #666; font-size: 16px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;
                      font-weight: 600;
                      font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getInstitutionVerificationEmailTemplate(
  verificationUrl: string,
  institutionName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Institution</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Institution Verification 🏛️</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify ${institutionName}</h2>
          
          <p style="color: #666; font-size: 16px;">
            An administrator has registered <strong>${institutionName}</strong> on Brainy. 
            Please verify this registration by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 14px 30px; 
                      text-decoration: none; 
                      border-radius: 6px; 
                      display: inline-block;
                      font-weight: 600;
                      font-size: 16px;">
              Verify Institution
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${verificationUrl}
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This link will expire in 24 hours. If you didn't register this institution, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getStudentVerificationOTPTemplate(otp: string, institutionName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Student Email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Student Verification 🎓</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Student Email</h2>
          
          <p style="color: #666; font-size: 16px;">
            You're registering as a student at <strong>${institutionName}</strong>. 
            Please use the verification code below to complete your registration.
          </p>
          
          <div style="text-align: center; margin: 30px 0; background: white; padding: 20px; border-radius: 8px; border: 2px dashed #667eea;">
            <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;">Your Verification Code</p>
            <p style="color: #667eea; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">
              ${otp}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Enter this code in the verification page to complete your registration.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This code will expire in 15 minutes. If you didn't request this code, please ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}
