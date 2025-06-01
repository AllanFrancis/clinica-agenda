"use client";

import { Trash2, User } from "lucide-react";
import { useState } from "react";

import { deletePatientAction } from "@/actions/patients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActiveClinic } from "@/contexts/clinic-context";

import { PatientDialog } from "./patient-dialog";

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

interface PatientsListProps {
  patients: Patient[];
  onUpdate: () => void;
}

export function PatientsList({ patients, onUpdate }: PatientsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const activeClinic = useActiveClinic();

  const handleDelete = async (patientId: string) => {
    if (!activeClinic) return;

    const confirmed = confirm("Tem certeza que deseja excluir este paciente?");
    if (!confirmed) return;

    setDeletingId(patientId);
    try {
      await deletePatientAction(patientId, activeClinic.id);
      onUpdate();
    } catch (error) {
      console.error("Erro ao deletar paciente:", error);
      alert("Erro ao deletar paciente. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const getSexLabel = (sex: "male" | "female") => {
    return sex === "male" ? "Masculino" : "Feminino";
  };

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">Nenhum paciente cadastrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece adicionando seu primeiro paciente.
        </p>
        <PatientDialog onSuccess={onUpdate} />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Cadastrado em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>
                <Badge variant="outline">{getSexLabel(patient.sex)}</Badge>
              </TableCell>
              <TableCell>{formatDate(patient.createdAt)}</TableCell>{" "}
              <TableCell>
                <div className="flex items-center gap-2">
                  <PatientDialog patient={patient} onSuccess={onUpdate} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(patient.id)}
                    disabled={deletingId === patient.id}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
