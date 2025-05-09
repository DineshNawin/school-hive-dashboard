'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeSelector } from "@/components/theme-selector"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AuthTokenStore } from "@/service/AuthTokenStore"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

export default function DashBoardLayout({ children }: { children: ReactNode }) {
  const authTokenStore = new AuthTokenStore();
  const router = useRouter();
  const [render, setRender] = useState(false);
  let token = null;

  useEffect(() => {
    const fetchToken = async ()=>{
      token = await authTokenStore.get();

      if (!token) {
        router.push('/login');
      }
      else {
        setRender(true);
      }
    }
    fetchToken();
  }, []);

  if (render) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
            <div className="pr-4">
              <ThemeSelector />
            </div>
          </header>
          <div className="p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    )
  }
}
