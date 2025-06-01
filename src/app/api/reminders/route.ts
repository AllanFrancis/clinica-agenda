import { NextRequest, NextResponse } from "next/server";

import { AppointmentReminderService } from "@/lib/appointment-reminder-service";

export async function POST(request: NextRequest) {
  try {
    const { type, hoursAhead } = await request.json();

    let result;

    switch (type) {
      case "tomorrow":
        result = await AppointmentReminderService.sendTomorrowReminders();
        break;

      case "same-day":
        result = await AppointmentReminderService.sendSameDayReminders(
          hoursAhead || 2,
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid reminder type. Use "tomorrow" or "same-day"' },
          { status: 400 },
        );
    }

    return NextResponse.json({
      message: "Reminders processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint to check reminder service status
export async function GET() {
  try {
    return NextResponse.json({
      message: "Appointment reminder service is active",
      endpoints: {
        tomorrow: 'POST /api/reminders { "type": "tomorrow" }',
        sameDay: 'POST /api/reminders { "type": "same-day", "hoursAhead": 2 }',
      },
      note: "These endpoints can be called by cron jobs or scheduled tasks",
    });
  } catch (error) {
    console.error("Error checking reminder service:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
