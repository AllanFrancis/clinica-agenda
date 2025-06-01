"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export interface CreatePatientData {
  name: string;
  email: string;
  phoneNumber: string;
  sex: "male" | "female";
  clinicId: string;
}

export interface UpdatePatientData extends CreatePatientData {
  id: string;
}

export async function createPatientAction(data: CreatePatientData) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db.insert(patientsTable).values({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      sex: data.sex,
      clinicId: data.clinicId,
    });

    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar paciente:", error);
    throw new Error("Erro ao criar paciente");
  }
}

export async function updatePatientAction(data: UpdatePatientData) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db
      .update(patientsTable)
      .set({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        sex: data.sex,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(patientsTable.id, data.id),
          eq(patientsTable.clinicId, data.clinicId),
        ),
      );

    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar paciente:", error);
    throw new Error("Erro ao atualizar paciente");
  }
}

export async function deletePatientAction(patientId: string, clinicId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    await db
      .delete(patientsTable)
      .where(
        and(
          eq(patientsTable.id, patientId),
          eq(patientsTable.clinicId, clinicId),
        ),
      );

    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar paciente:", error);
    throw new Error("Erro ao deletar paciente");
  }
}

export async function getClinicPatientsAction(clinicId: string) {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((m) => m.headers()),
  });

  if (!session) {
    redirect("/authentication");
  }

  try {
    const patients = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.clinicId, clinicId))
      .orderBy(patientsTable.name);

    return patients;
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    throw new Error("Erro ao buscar pacientes");
  }
}
