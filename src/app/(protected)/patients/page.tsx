"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";

import { getClinicPatientsAction } from "@/actions/patients";
import { useActiveClinic } from "@/contexts/clinic-context";

import { PatientDialog } from "./components/patient-dialog";
import { PatientsList } from "./components/patients-list";

interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  sex: "male" | "female";
  clinicId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const activeClinic = useActiveClinic();
  const loadPatients = async () => {
    if (!activeClinic) return;

    setIsLoading(true);
    try {
      const patientsData = await getClinicPatientsAction(activeClinic.id);
      setPatients(patientsData);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeClinic) {
      loadPatients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClinic]);

  if (!activeClinic) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Selecione uma clínica para ver os pacientes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Pacientes</h1>
            <p className="text-muted-foreground">
              Gerencie os pacientes da sua clínica
            </p>
          </div>
        </div>
        <PatientDialog onSuccess={loadPatients} />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Carregando pacientes...</p>
        </div>
      ) : (
        <PatientsList patients={patients} onUpdate={loadPatients} />
      )}
    </div>
  );
};

export default PatientsPage;
