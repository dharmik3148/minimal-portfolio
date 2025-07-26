"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Volume2, VolumeOff } from "lucide-react";
import Magnet from "../effects/Magnet";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactHowler from "react-howler";

const Navbar = ({ data }) => {
  const [open, setOpen] = useState(false);

  const isMobile = useIsMobile();

  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const musicPath = data?.musicpath;

  const links = [
    { name: "Home", href: "/" },
    { name: "About Me", href: "#about" },
    { name: "My Work", href: "#work" },
    { name: "Journey", href: "#journey" },
    { name: "Certifications", href: "#certifications" },
    { name: "Tech Stack", href: "#techstack" },
    { name: "Socials", href: "#socials" },
  ];

  const toggleAudio = () => {
    if (playing) {
      setPlaying(false);
      setIsMuted(true);
    } else {
      setPlaying(true);
      setIsMuted(false);
    }
  };

  return (
    <nav className="z-[2] text-[darkBlue] text-[20px] flex items-center justify-between fixed top-[15px] right-[15px] left-[15px] px-[15px] h-[50px]">
      {musicPath && (
        <div className="hidden">
          <ReactHowler
            src={musicPath}
            playing={playing}
            loop
            mute={isMuted}
            volume={1.0}
          />
        </div>
      )}

      <div className="grid grid-cols-3 w-full">
        <div className="col-span-1 flex mr-auto">
          <span className="flex items-center gap-1 font-light text-[darkBlue] text-[17px] mix-blend-difference">
            <MapPin size={17} /> Adelaide,SA
            <div className="rounded-full p-1 flex" onClick={toggleAudio}>
              {playing ? (
                <Volume2 size={20} className="text-green-700 cursor-pointer" />
              ) : (
                <VolumeOff size={20} className="text-red-700 cursor-pointer" />
              )}
            </div>
          </span>
        </div>
        <div className="col-span-1 flex justify-center">
          {!isMobile && (
            <Link
              href={"/"}
              className="text-[darkBlue] flex text-[17px] font-normal hover:bg-[darkOrange]"
            >
              [home]
            </Link>
          )}
        </div>
        <div className="col-span-1 flex ml-auto">
          <Magnet
            padding={50}
            disabled={false}
            magnetStrength={3}
            innerClassName="hover:cursor-pointer hover:bg-[darkOrange] font-normal text-[17px]"
            onClick={() => setOpen(!open)}
          >
            <span>[{open === true ? "exit" : "menu"}]</span>
          </Magnet>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[1]"
              onClick={() => setOpen(false)}
            ></div>

            {/* Menu */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed top-[17px] right-[17px] left-[17px] bottom-[17px] overflow-y-scroll border-t-[2px] border-[darkBlue] mt-[45px] p-[50px] bg-[darkOrange]/70 backdrop-blur-md text-[#2a2a2a] z-[2]"
            >
              <section className="flex flex-col text-center w-full gap-[30px] text-[50px]">
                {links?.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="hover:cursor-pointer text-5xl font-light font-serif hover:text-[darkBlue] italic hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </section>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
