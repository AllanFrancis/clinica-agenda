import { NextRequest, NextResponse } from "next/server";

import EmailService from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...emailData } = body;

    let result;

    switch (type) {
      case "appointment-confirmation":
        result = await EmailService.sendAppointmentConfirmation(emailData);
        break;

      case "appointment-reminder":
        result = await EmailService.sendAppointmentReminder(emailData);
        break;

      case "appointment-cancellation":
        result = await EmailService.sendAppointmentCancellation(emailData);
        break;

      case "welcome":
        result = await EmailService.sendWelcomeEmail(emailData);
        break;

      case "generic":
        result = await EmailService.sendEmail(emailData);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 },
        );
    }

    if (result.success) {
      return NextResponse.json({
        message: "Email sent successfully",
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in email API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint to test if the email service is configured
export async function GET() {
  try {
    const isConfigured = !!process.env.RESEND_API_KEY;

    return NextResponse.json({
      configured: isConfigured,
      message: isConfigured
        ? "Email service is configured"
        : "RESEND_API_KEY environment variable is missing",
    });
  } catch (error) {
    console.error("Error checking email configuration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
