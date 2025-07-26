import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/adminComponents/AppSidebar";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Page",
  description: "Admin Page Description",
};

export default function AdminLayout({ children }) {
  return (
    <html>
      <body className="bg-white">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col h-screen w-screen overflow-hidden">
            <div className="sticky left-0 top-0 right-0 border-b-[1px] border-[#f5f5f5] bg-[#2a2a2a] z-10 p-2.5">
              <SidebarTrigger className="cursor-pointer bg-white" />
            </div>
            <div className="flex-1 overflow-auto p-3 bg-[#2a2a2a] text-white">
              <Toaster
                toastOptions={{
                  style: {
                    background: "#fff",
                    color: "#000",
                  },
                }}
              />
              {children}
            </div>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
