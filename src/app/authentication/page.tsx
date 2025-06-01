import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserClinicsAction } from "@/actions/get-user-clinics";
import {} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import SignInForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    try {
      const userClinics = await getUserClinicsAction();
      if (userClinics.length === 0) {
        redirect("/onboarding");
      } else {
        redirect("/dashboard");
      }
    } catch (error) {
      console.error("Error checking user clinics:", error);
      redirect("/dashboard");
    }
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <SignInForm />
          </TabsContent>
          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthenticationPage;
