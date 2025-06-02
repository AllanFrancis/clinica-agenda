"use client";

import { UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getClinicDoctorsAction } from "@/actions/doctors";
import { useActiveClinic } from "@/contexts/clinic-context";

import { DoctorDialog } from "./components/doctor-dialog";
import { DoctorsList } from "./components/doctors-list";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarImageUrl: string | null;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
  appointmentPriceInCents: number;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const activeClinic = useActiveClinic();
  const loadDoctors = useCallback(async () => {
    if (!activeClinic) return;

    setIsLoading(true);
    try {
      const doctorsData = await getClinicDoctorsAction(activeClinic.id);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Erro ao carregar doutores:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeClinic]);

  useEffect(() => {
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClinic]);

  if (!activeClinic) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Selecione uma clínica para ver os doutores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Doutores</h1>
            <p className="text-muted-foreground">
              Gerencie os doutores da sua clínica
            </p>
          </div>
        </div>
        <DoctorDialog onSuccess={loadDoctors} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Carregando doutores...</p>
        </div>
      ) : (
        <DoctorsList doctors={doctors} onUpdate={loadDoctors} />
      )}
    </div>
  );
};

export default DoctorsPage;
