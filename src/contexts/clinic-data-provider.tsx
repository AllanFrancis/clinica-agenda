"use client";

import { useEffect } from "react";

import { getUserClinicsAction } from "@/actions/get-user-clinics";

import { ClinicProvider, useClinic } from "./clinic-context";

interface Clinic {
  id: string;
  name: string;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  joinedAt: Date;
}

interface ClinicDataProviderProps {
  children: React.ReactNode;
  initialClinics?: Clinic[];
}

function ClinicDataLoader({ children }: { children: React.ReactNode }) {
  const { setClinics, clinics } = useClinic();

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const userClinics = await getUserClinicsAction();
        setClinics(userClinics);
      } catch (error) {
        console.error("Erro ao carregar clínicas:", error);
        setClinics([]);
      }
    };

    // Só carrega se ainda não tem clínicas
    if (clinics.length === 0) {
      loadClinics();
    }
  }, [setClinics, clinics.length]);

  return <>{children}</>;
}

export function ClinicDataProvider({
  children,
  initialClinics = [],
}: ClinicDataProviderProps) {
  return (
    <ClinicProvider initialClinics={initialClinics}>
      <ClinicDataLoader>{children}</ClinicDataLoader>
    </ClinicProvider>
  );
}
