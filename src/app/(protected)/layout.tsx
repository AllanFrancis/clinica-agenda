import { AuthWrapper } from "@/components/auth-wrapper";
import { ClinicProtection } from "@/components/clinic-protection";
import { AppSidebarServer } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ClinicDataProvider } from "@/contexts/clinic-data-provider";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthWrapper>
      <ClinicDataProvider>
        <ClinicProtection>
          <SidebarProvider>
            <AppSidebarServer />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Sistema de agendamento de clínicas
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </header>{" "}
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ClinicProtection>
      </ClinicDataProvider>
    </AuthWrapper>
  );
};

export default ProtectedLayout;
