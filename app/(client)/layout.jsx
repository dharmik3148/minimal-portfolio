import "../globals.css";
import Noise from "@/components/effects/Noise";
import CreepyGrid from "@/components/effects/CreepyGrid";
import SmoothScroll from "@/components/effects/SmoothScroll";
import Navbar from "@/components/clientComponents/Navbar";

import axios from "axios";
import { getCookie } from "cookies-next";

export default async function RootLayout({ children }) {
  const pathname = getCookie("next-url") || "";
  const isAdmin = pathname.startsWith("/admin");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/alldata`
  );
  const homepageData = response.data;

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <body
        className={isAdmin ? "bg-[#f5f5f5]" : "transparent-border font-medium"}
      >
        {!isAdmin && (
          <>
            <div
              style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: -2,
                overflow: "hidden",
              }}
            >
              <Noise
                patternSize={250}
                patternScaleX={2}
                patternScaleY={2}
                patternRefreshInterval={3}
                patternAlpha={20}
              />
            </div>

            <div className="w-screen h-screen fixed top-0 left-0 z-[-1] hidden md:block">
              <CreepyGrid />
            </div>

            <div
              style={{
                position: "fixed",
                top: "15px",
                left: "15px",
                right: "15px",
                bottom: "15px",
                border: "2px solid #102e50",
                pointerEvents: "none",
                zIndex: 1,
              }}
            ></div>

            <SmoothScroll />
          </>
        )}
        {!isAdmin && <Navbar data={homepageData.homepage} />}
        {children}
      </body>
    </html>
  );
}
