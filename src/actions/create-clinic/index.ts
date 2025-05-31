"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

interface CreateClinicData {
  name: string;
  logo?: string;
}

export const createClinicAction = async (data: CreateClinicData) => {
  // Verificar se o usuario esta logado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  // returning retorna o objeto inserido
  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name: data.name,
      logo: data.logo,
    })
    .returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  redirect("/dashboard");
};
