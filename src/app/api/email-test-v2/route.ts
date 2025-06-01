import { NextResponse } from "next/server";
import { EmailService } from "@/lib/email-service";

export async function GET() {
  try {
    const result = await EmailService.sendWelcomeEmail({
      to: "test@example.com",
      userName: "Test User",
      clinicName: "Test Clinic"
    });
    
    return NextResponse.json({
      message: "Email test successful",
      result
    });
  } catch (error) {
    console.error("Error testing email service:", error);
    return NextResponse.json(
      { 
        error: "Error testing email service",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
