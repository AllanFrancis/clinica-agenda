import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserClinicsAction } from "@/actions/get-user-clinics";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await getUserClinicsAction();

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }

  return <div className="flex flex-1 flex-col gap-4 p-4">Dashboard</div>;
}
