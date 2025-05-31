"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getUserClinicsAction = async () => {
  // Verificar se o usuario esta logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  // Buscar todas as clínicas vinculadas ao usuário com detalhes da clínica
  const userClinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
    with: {
      clinic: true,
    },
  });

  return userClinics.map((userClinic) => ({
    id: userClinic.clinic.id,
    name: userClinic.clinic.name,
    logo: userClinic.clinic.logo,
    createdAt: userClinic.clinic.createdAt,
    updatedAt: userClinic.clinic.updatedAt,
    joinedAt: userClinic.createdAt,
  }));
};
