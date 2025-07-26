"use client";

import React from "react";
import DevImage from "../../assets/devimage.png";
import Image from "next/image";
import DecryptedText from "../effects/DecryptedText";
import Magnet from "../effects/Magnet";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const HeroSection = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No Homepage Data</p>;
  }

  return (
    <div className="flex justify-around px-[10%] items-center max-sm:flex-col max-sm:px-[5%] max-sm:gap-6">
      <div className="w-[400px] max-md:w-[300px] max-sm:w-full">
        <Magnet
          padding={30}
          className="mb-3"
          disabled={false}
          magnetStrength={8}
        >
          <h1 className="text-[darkBlue] text-4xl text-shadow-lg max-sm:text-4xl">
            <DecryptedText
              text={data ? data.hone : "Hello there"}
              speed={100}
              maxIterations={20}
              characters="*@#$%^&*()_+[]{}|;':,.<>?"
              className="revealed hover:bg-[darkOrange] font-normal"
              revealDirection="start"
              animateOn="view"
              sequential={true}
            />
          </h1>
        </Magnet>
        <br />
        <h2 className="text-[darkBlack] font-light text-xl text-shadow-lg max-sm:text-[18px]">
          {data ? data.htwo : "IT Professional"}
        </h2>
        <Link
          href={data.resumepath}
          target="_blank"
          className="flex items-end justify-center gap-1 hover:text-[darkOrange] underline font-extrabold text-4xl w-fit bg-transperance rounded-none mt-3 text-[darkGreen] text-[20px]"
        >
          resume <ExternalLink size={18} />
        </Link>
      </div>

      <Magnet
        padding={10}
        disabled={false}
        magnetStrength={10}
        innerClassName="hover:cursor-pointer my-[10px]"
      >
        <Image
          src={data ? `/${data.imagepath}` : DevImage}
          alt="Developer"
          height={100}
          width={100}
          className="w-[400px] h-[400px] max-w-full max-h-[80vh] select-none rounded-[40%] pointer-events-none drop-shadow-[0_5px_25px_rgba(0,0,0,0.6)] max-sm:w-[220px] max-sm:h-[220px] max-md:w-[250px] max-md:h-[250px]"
        />
      </Magnet>
    </div>
  );
};

export default HeroSection;
