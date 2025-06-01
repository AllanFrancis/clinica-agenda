"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface CreateDoctorData {
  name: string;
  specialty: string;
  avatarImageUrl?: string;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
  appointmentPriceInCents: number;
  clinicId: string;
}

export interface UpdateDoctorData extends CreateDoctorData {
  id: string;
}

export async function createDoctorAction(data: CreateDoctorData) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db.insert(doctorsTable).values({
      name: data.name,
      specialty: data.specialty,
      avatarImageUrl: data.avatarImageUrl,
      availableFromWeekDay: data.availableFromWeekDay,
      availableToWeekDay: data.availableToWeekDay,
      availableFromTime: data.availableFromTime,
      availableToTime: data.availableToTime,
      appointmentPriceInCents: data.appointmentPriceInCents,
      clinicId: data.clinicId,
    });

    revalidatePath("/doctors");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar doutor:", error);
    throw new Error("Erro ao criar doutor");
  }
}

export async function updateDoctorAction(data: UpdateDoctorData) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db
      .update(doctorsTable)
      .set({
        name: data.name,
        specialty: data.specialty,
        avatarImageUrl: data.avatarImageUrl,
        availableFromWeekDay: data.availableFromWeekDay,
        availableToWeekDay: data.availableToWeekDay,
        availableFromTime: data.availableFromTime,
        availableToTime: data.availableToTime,
        appointmentPriceInCents: data.appointmentPriceInCents,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(doctorsTable.id, data.id),
          eq(doctorsTable.clinicId, data.clinicId),
        ),
      );

    revalidatePath("/doctors");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar doutor:", error);
    throw new Error("Erro ao atualizar doutor");
  }
}

export async function deleteDoctorAction(doctorId: string, clinicId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db
      .delete(doctorsTable)
      .where(
        and(eq(doctorsTable.id, doctorId), eq(doctorsTable.clinicId, clinicId)),
      );

    revalidatePath("/doctors");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar doutor:", error);
    throw new Error("Erro ao deletar doutor");
  }
}

export async function getClinicDoctorsAction(clinicId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    const doctors = await db
      .select()
      .from(doctorsTable)
      .where(eq(doctorsTable.clinicId, clinicId))
      .orderBy(doctorsTable.name);

    return doctors;
  } catch (error) {
    console.error("Erro ao buscar doutores:", error);
    throw new Error("Erro ao buscar doutores");
  }
}
