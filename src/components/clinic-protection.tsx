"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserClinicsAction } from "@/actions/get-user-clinics";

interface ClinicProtectionProps {
  children: React.ReactNode;
}

export function ClinicProtection({ children }: ClinicProtectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasClinic, setHasClinic] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserClinics = async () => {
      try {
        const clinics = await getUserClinicsAction();

        if (clinics.length === 0) {
          router.push("/onboarding");
          return;
        }

        setHasClinic(true);
      } catch (error) {
        console.error("Error checking user clinics:", error);
        router.push("/onboarding");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserClinics();
  }, [router]);

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

  if (!hasClinic) {
    return null; // Já redirecionou para onboarding
  }

  return <>{children}</>;
}
