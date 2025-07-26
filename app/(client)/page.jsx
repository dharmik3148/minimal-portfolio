import React from "react";

import AboutInfo from "@/components/clientComponents/AboutInfo";
import Certifications from "@/components/clientComponents/Certifications";
import ContactMe from "@/components/clientComponents/ContactMe";
import Experiences from "@/components/clientComponents/Experiences";
import HeroSection from "@/components/clientComponents/HeroSection";
import Projects from "@/components/clientComponents/Projects";
import TechStack from "@/components/clientComponents/TechStack";
import ScrollVelocity from "@/components/effects/ScrollVelocity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dharmik - Portfolio",
  description: "Admin Page Description",
};

const Home = async () => {
  let data = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/alldata`, {
      cache: "no-store",
    });
    data = await res.json();
  } catch (error) {
    console.error("Error in getAllData:", error);
    return {};
  }

  return (
    <div className="pb-[50px]">
      <section className="mx-[15px] mt-[80px] mb-[20px] ">
        {data.homepage && <HeroSection data={data.homepage} />}
      </section>
      <section className="mx-[15px] mt-[40px] transform skew-y-[-3deg] origin-right">
        <ScrollVelocity
          texts={[
            "Open-To-Work & FrontEnd & BackEnd & Cloud-Deployment & Database-Management &",
            "FullStack-Development & Programming & Open-To-Work & CyberSecurity & Networking &",
          ]}
          velocity={30}
          className="text-[darkBlue] text-[25px] font-light tracking-[-0.02em] drop-shadow md:text-[27px] md:leading-[33px]"
        />
      </section>
      <div id="about" className="mx-[15px] mt-[50px] md:mt-[120px]">
        <AboutInfo data={data.homepage} />
      </div>
      <div id="work" className="mx-[15px] mt-[20px] md:mt-[50px]">
        <Projects data={data.work} />
      </div>
      <div id="journey" className="mx-[15px] mt-[20px] md:mt-[50px]">
        <Experiences data={data.experience} />
      </div>
      <div id="certifications" className="mx-[15px] mt-[20px] md:mt-[50px]">
        <Certifications data={data.achievements} />
      </div>
      <div id="techstack" className="mx-[15px] mt-[20px] md:mt-[50px]">
        <TechStack data={data.skill} />
      </div>
      <div id="socials" className="mx-[15px] mt-[20px] md:mt-[50px]">
        <ContactMe data={data.contact} />
      </div>
    </div>
  );
};

export default Home;
