import { Toaster } from "sonner";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Login",
  description: "Admin Page Description",
};

export default function LoginLayout({ children }) {
  return (
    <html>
      <body className="bg-white">
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
