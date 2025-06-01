"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useHasClinics } from "@/contexts/clinic-context";

interface ClinicProtectionProps {
  children: React.ReactNode;
}

export function ClinicProtection({ children }: ClinicProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const hasClinics = useHasClinics();
  const router = useRouter();

  useEffect(() => {
    // Aguarda um pouco para o contexto carregar
    const timer = setTimeout(() => {
      if (!hasClinics) {
        router.push("/onboarding");
        return;
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasClinics, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Verificando suas clínicas...</p>
        </div>
      </div>
    );
  }
  if (!hasClinics) {
    return null; // Já redirecionou para onboarding
  }

  return <>{children}</>;
}
