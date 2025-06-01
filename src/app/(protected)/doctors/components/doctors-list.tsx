"use client";

import { Clock, DollarSign, Trash2, UserCheck } from "lucide-react";
import { useState } from "react";

import { deleteDoctorAction } from "@/actions/doctors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { DoctorDialog } from "./doctor-dialog";

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

interface DoctorsListProps {
  doctors: Doctor[];
  onUpdate: () => void;
}

const weekDays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function DoctorsList({ doctors, onUpdate }: DoctorsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const activeClinic = useActiveClinic();

  const handleDelete = async (doctorId: string) => {
    if (!activeClinic) return;

    const confirmed = confirm("Tem certeza que deseja excluir este doutor?");
    if (!confirmed) return;

    setDeletingId(doctorId);
    try {
      await deleteDoctorAction(doctorId, activeClinic.id);
      onUpdate();
    } catch (error) {
      console.error("Erro ao deletar doutor:", error);
      alert("Erro ao deletar doutor. Tente novamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  const formatSchedule = (doctor: Doctor) => {
    const fromDay = weekDays[doctor.availableFromWeekDay];
    const toDay = weekDays[doctor.availableToWeekDay];

    if (doctor.availableFromWeekDay === doctor.availableToWeekDay) {
      return `${fromDay}`;
    }

    return `${fromDay} - ${toDay}`;
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds if present
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <UserCheck className="text-muted-foreground mb-4 h-12 w-12" />
        <h3 className="text-lg font-semibold">Nenhum doutor cadastrado</h3>
        <p className="text-muted-foreground mb-4">
          Comece adicionando seu primeiro doutor.
        </p>
        <DoctorDialog onSuccess={onUpdate} />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doutor</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={doctor.avatarImageUrl || ""}
                      alt={doctor.name}
                    />
                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{doctor.specialty}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  {formatSchedule(doctor)}
                </div>
              </TableCell>
              <TableCell>
                {formatTime(doctor.availableFromTime)} -{" "}
                {formatTime(doctor.availableToTime)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  {formatCurrency(doctor.appointmentPriceInCents)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DoctorDialog doctor={doctor} onSuccess={onUpdate} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doctor.id)}
                    disabled={deletingId === doctor.id}
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
