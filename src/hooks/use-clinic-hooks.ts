import { useActiveClinic } from "@/contexts/clinic-context";

/**
 * Hook para obter informações da clínica ativa
 * Retorna informações úteis sobre a clínica selecionada
 */
export function useActiveClinicInfo() {
  const activeClinic = useActiveClinic();

  if (!activeClinic) {
    return {
      clinicId: null,
      clinicName: null,
      clinicLogo: null,
      hasActiveClinic: false,
    };
  }

  return {
    clinicId: activeClinic.id,
    clinicName: activeClinic.name,
    clinicLogo: activeClinic.logo,
    hasActiveClinic: true,
    createdAt: activeClinic.createdAt,
    updatedAt: activeClinic.updatedAt,
    joinedAt: activeClinic.joinedAt,
  };
}

/**
 * Hook para verificar se o usuário é proprietário/admin da clínica ativa
 * (Para implementar futuramente quando houver roles)
 */
export function useClinicPermissions() {
  const activeClinic = useActiveClinic();

  // Por enquanto, todos os usuários têm permissão total
  // Futuramente pode incluir verificação de roles
  return {
    canEdit: !!activeClinic,
    canDelete: !!activeClinic,
    canManageUsers: !!activeClinic,
    canViewReports: !!activeClinic,
  };
}
