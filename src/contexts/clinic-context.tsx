"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Clinic {
  id: string;
  name: string;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  joinedAt: Date;
}

interface ClinicContextType {
  clinics: Clinic[];
  activeClinic: Clinic | null;
  setActiveClinic: (clinic: Clinic) => void;
  setClinics: (clinics: Clinic[]) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

interface ClinicProviderProps {
  children: ReactNode;
  initialClinics?: Clinic[];
  initialActiveClinic?: Clinic;
}

export function ClinicProvider({
  children,
  initialClinics = [],
  initialActiveClinic,
}: ClinicProviderProps) {
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [activeClinic, setActiveClinicState] = useState<Clinic | null>(
    initialActiveClinic || null,
  );

  // Carregar clínica ativa do localStorage ao inicializar
  useEffect(() => {
    const savedClinicId = localStorage.getItem("activeClinicId");
    if (savedClinicId && clinics.length > 0) {
      const savedClinic = clinics.find((clinic) => clinic.id === savedClinicId);
      if (savedClinic) {
        setActiveClinicState(savedClinic);
      } else if (!activeClinic && clinics.length > 0) {
        // Se a clínica salva não existe mais, seleciona a primeira
        setActiveClinicState(clinics[0]);
      }
    } else if (!activeClinic && clinics.length > 0) {
      // Se não há clínica salva, seleciona a primeira
      setActiveClinicState(clinics[0]);
    }
  }, [clinics, activeClinic]);

  // Salvar clínica ativa no localStorage quando mudar
  const setActiveClinic = (clinic: Clinic) => {
    setActiveClinicState(clinic);
    localStorage.setItem("activeClinicId", clinic.id);
  };

  // Atualizar lista de clínicas
  const updateClinics = (newClinics: Clinic[]) => {
    setClinics(newClinics);

    // Se a clínica ativa não está mais na lista, seleciona a primeira
    if (activeClinic && !newClinics.find((c) => c.id === activeClinic.id)) {
      if (newClinics.length > 0) {
        setActiveClinic(newClinics[0]);
      } else {
        setActiveClinicState(null);
        localStorage.removeItem("activeClinicId");
      }
    }
  };
  const value: ClinicContextType = {
    clinics,
    activeClinic,
    setActiveClinic,
    setClinics: updateClinics,
  };

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinic must be used within a ClinicProvider");
  }
  return context;
}

// Hook para obter apenas a clínica ativa (mais comum)
export function useActiveClinic() {
  const { activeClinic } = useClinic();
  return activeClinic;
}

// Hook para verificar se o usuário tem clínicas
export function useHasClinics() {
  const { clinics } = useClinic();
  return clinics.length > 0;
}
