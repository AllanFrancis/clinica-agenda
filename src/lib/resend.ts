import { Resend } from "resend";

// Initialize Resend with API key from environment variables
// Use a fallback key for development if not configured
const apiKey =
  process.env.RESEND_API_KEY || "re_123456789_fake_key_for_development";
export const resend = new Resend(apiKey);

// Check if Resend is properly configured
export const isResendConfigured = () => {
  return (
    process.env.RESEND_API_KEY &&
    process.env.RESEND_API_KEY !== "your_resend_api_key_here"
  );
};

// Email configuration
export const EMAIL_CONFIG = {
  from: "Clínica Agenda <noreply@tatamepro.com.br>", // Replace with your verified domain
  replyTo: "support@yourdomain.com", // Replace with your support email
};

// Email templates configuration
export const EMAIL_TEMPLATES = {
  APPOINTMENT_CONFIRMATION: "appointment-confirmation",
  APPOINTMENT_REMINDER: "appointment-reminder",
  APPOINTMENT_CANCELLATION: "appointment-cancellation",
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
} as const;

export type EmailTemplate =
  (typeof EMAIL_TEMPLATES)[keyof typeof EMAIL_TEMPLATES];
