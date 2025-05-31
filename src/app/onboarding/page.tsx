import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { OnboardingForm } from "./components/onboarding-form";

const OnboardingPage = async () => {
  // Verificar se o usuário está autenticado
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authentication");
  }

  return (
    <div className="from-primary/50 to-primary-foreground flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <OnboardingForm />
    </div>
  );
};

export default OnboardingPage;
