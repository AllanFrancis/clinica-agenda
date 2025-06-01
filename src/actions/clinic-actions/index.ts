"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

/**
 * Action que requer uma clínica específica
 * Exemplo de como passar o ID da clínica ativa para o servidor
 */
export const getClinicAppointmentsAction = async (clinicId: string) => {
  // Verificar se o usuário está logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se o usuário tem acesso à clínica
  const userClinic = await db.query.usersToClinicsTable.findFirst({
    where:
      eq(usersToClinicsTable.userId, session.user.id) &&
      eq(usersToClinicsTable.clinicId, clinicId),
  });

  if (!userClinic) {
    throw new Error("Usuário não tem acesso a esta clínica");
  }

  // Aqui você buscaria os agendamentos da clínica
  // Por enquanto, retorna um array vazio
  // const appointments = await db.query.appointmentsTable.findMany({
  //   where: eq(appointmentsTable.clinicId, clinicId),
  // });

  return []; // appointments
};

/**
 * Action para buscar dados da clínica específica
 */
export const getClinicDataAction = async (clinicId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se o usuário tem acesso à clínica
  const userClinic = await db.query.usersToClinicsTable.findFirst({
    where:
      eq(usersToClinicsTable.userId, session.user.id) &&
      eq(usersToClinicsTable.clinicId, clinicId),
    with: {
      clinic: true,
    },
  });

  if (!userClinic) {
    throw new Error("Usuário não tem acesso a esta clínica");
  }

  return userClinic.clinic;
};
