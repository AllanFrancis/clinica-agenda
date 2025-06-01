"use client";

import { Building2, Calendar, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { getClinicDataAction } from "@/actions/clinic-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveClinicInfo } from "@/hooks/use-clinic-hooks";

interface ClinicStats {
  totalPatients: number;
  totalAppointments: number;
  monthlyRevenue: number;
}

export function ClinicDashboard() {
  const { clinicId, clinicName, hasActiveClinic } = useActiveClinicInfo();
  const [stats, setStats] = useState<ClinicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasActiveClinic || !clinicId) {
      setLoading(false);
      return;
    }

    const loadClinicData = async () => {
      try {
        // Aqui você faria as chamadas para buscar dados da clínica ativa
        // const clinicData = await getClinicDataAction(clinicId);

        // Por enquanto, dados mockados
        setStats({
          totalPatients: 150,
          totalAppointments: 45,
          monthlyRevenue: 15000,
        });
      } catch (error) {
        console.error("Erro ao carregar dados da clínica:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClinicData();
  }, [clinicId, hasActiveClinic]);

  if (!hasActiveClinic) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Nenhuma clínica selecionada
          </h3>
          <p className="mt-2 text-gray-500">
            Selecione uma clínica para ver o dashboard
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-500">Carregando dados da clínica...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard - {clinicName}
        </h1>
        <p className="text-gray-600">Visão geral da sua clínica</p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Pacientes
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-muted-foreground text-xs">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Agendamentos este mês
              </CardTitle>
              <Calendar className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAppointments}
              </div>
              <p className="text-muted-foreground text-xs">
                +8% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.monthlyRevenue.toLocaleString("pt-BR")}
              </div>
              <p className="text-muted-foreground text-xs">
                +20% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
