import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "@/db/schema";
import { EmailService } from "@/lib/email-service";

/**
 * Utility to send appointment reminders
 * This can be called from a cron job or scheduled task
 */
export class AppointmentReminderService {
  /**
   * Send reminders for appointments happening tomorrow
   */
  static async sendTomorrowReminders() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Get all appointments for tomorrow
      const appointments = await db
        .select({
          appointmentId: appointmentsTable.id,
          appointmentDate: appointmentsTable.date,
          patientName: patientsTable.name,
          patientEmail: patientsTable.email,
          doctorName: doctorsTable.name,
          clinicName: clinicsTable.name,
        })
        .from(appointmentsTable)
        .innerJoin(
          patientsTable,
          eq(appointmentsTable.patientId, patientsTable.id),
        )
        .innerJoin(
          doctorsTable,
          eq(appointmentsTable.doctorId, doctorsTable.id),
        )
        .innerJoin(
          clinicsTable,
          eq(appointmentsTable.clinicId, clinicsTable.id),
        )
        .where(
          and(
            gte(appointmentsTable.date, tomorrow),
            lte(appointmentsTable.date, dayAfterTomorrow),
          ),
        );

      console.log(`Found ${appointments.length} appointments for tomorrow`);

      const results = await Promise.allSettled(
        appointments.map(async (appointment) => {
          const result = await EmailService.sendAppointmentReminder({
            to: appointment.patientEmail,
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            appointmentTime: appointment.appointmentDate.toLocaleTimeString(
              "pt-BR",
              { hour: "2-digit", minute: "2-digit" },
            ),
            appointmentDate:
              appointment.appointmentDate.toLocaleDateString("pt-BR"),
            clinicName: appointment.clinicName,
          });

          if (result.success) {
            console.log(
              `Reminder sent to ${appointment.patientEmail} for appointment ${appointment.appointmentId}`,
            );
          } else {
            console.error(
              `Failed to send reminder to ${appointment.patientEmail}:`,
              result.error,
            );
          }

          return result;
        }),
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled" && result.value.success,
      ).length;
      const failed = results.length - successful;

      return {
        total: appointments.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      console.error("Error sending appointment reminders:", error);
      throw error;
    }
  }

  /**
   * Send reminders for appointments in the next few hours
   */
  static async sendSameDayReminders(hoursAhead: number = 2) {
    try {
      const now = new Date();
      const reminderTime = new Date(
        now.getTime() + hoursAhead * 60 * 60 * 1000,
      );

      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      // Get appointments for today that are within the reminder window
      const appointments = await db
        .select({
          appointmentId: appointmentsTable.id,
          appointmentDate: appointmentsTable.date,
          patientName: patientsTable.name,
          patientEmail: patientsTable.email,
          doctorName: doctorsTable.name,
          clinicName: clinicsTable.name,
        })
        .from(appointmentsTable)
        .innerJoin(
          patientsTable,
          eq(appointmentsTable.patientId, patientsTable.id),
        )
        .innerJoin(
          doctorsTable,
          eq(appointmentsTable.doctorId, doctorsTable.id),
        )
        .innerJoin(
          clinicsTable,
          eq(appointmentsTable.clinicId, clinicsTable.id),
        )
        .where(
          and(
            gte(appointmentsTable.date, startOfDay),
            lte(appointmentsTable.date, endOfDay),
          ),
        );

      // Filter appointments that are within the reminder time window
      const upcomingAppointments = appointments.filter((appointment) => {
        const [hours, minutes] = appointment.appointmentDate
          .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          .split(":")
          .map(Number);
        const appointmentDateTime = new Date(appointment.appointmentDate);
        appointmentDateTime.setHours(hours, minutes, 0, 0);

        // Send reminder if appointment is within the next X hours
        return appointmentDateTime > now && appointmentDateTime <= reminderTime;
      });

      console.log(
        `Found ${upcomingAppointments.length} appointments in the next ${hoursAhead} hours`,
      );

      const results = await Promise.allSettled(
        upcomingAppointments.map(async (appointment) => {
          const result = await EmailService.sendAppointmentReminder({
            to: appointment.patientEmail,
            patientName: appointment.patientName,
            doctorName: appointment.doctorName,
            appointmentDate:
              appointment.appointmentDate.toLocaleDateString("pt-BR"),
            appointmentTime: appointment.appointmentDate.toLocaleTimeString(
              "pt-BR",
              { hour: "2-digit", minute: "2-digit" },
            ),

            clinicName: appointment.clinicName,
          });

          if (result.success) {
            console.log(
              `Same-day reminder sent to ${appointment.patientEmail}`,
            );
          } else {
            console.error(
              `Failed to send same-day reminder to ${appointment.patientEmail}:`,
              result.error,
            );
          }

          return result;
        }),
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled" && result.value.success,
      ).length;
      const failed = results.length - successful;

      return {
        total: upcomingAppointments.length,
        successful,
        failed,
        results,
      };
    } catch (error) {
      console.error("Error sending same-day appointment reminders:", error);
      throw error;
    }
  }
}
