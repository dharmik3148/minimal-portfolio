"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const ContactMe = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No Contact Data</p>;
  }

  return (
    <section className="flex items-center justify-center py-5">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-5">
        <h3 className="text-4xl text-[darkBlue] font-normal tracking-tighter mb-6">
          Socials
        </h3>

        {data?.map((item, id) => {
          const Icon = LucideIcons[item.iconName];
          return (
            <Link
              key={id}
              href={item.value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex border-b-1 border-[#2a2a2a] gap-2 w-fit rounded-none bg-transparent  py-2 text-[darkGreen]"
            >
              {Icon ? (
                <Icon className="text-[#2a2a2a]" />
              ) : (
                <span className="text-[#2a2a2a]">⚠️</span>
              )}
              {item.title}
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ContactMe;
