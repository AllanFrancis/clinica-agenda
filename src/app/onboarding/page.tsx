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
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Bem-vindo à Clínica Agenda!
          </h1>
          <p className="text-gray-600">
            Para começar, vamos criar sua primeira clínica
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
};

export default OnboardingPage;
