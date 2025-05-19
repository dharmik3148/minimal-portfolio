"use client";

import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Forward } from "lucide-react";

const Certifications = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No Cerifications</p>;
  }

  return (
    <section className="flex items-center justify-center py-5">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-3">
        <h3 className="text-4xl text-[darkBlue] mt-2 font-normal tracking-tighter mb-6">
          Certifications
        </h3>

        {data?.map((item, id) => {
          return (
            <Card
              className="p-2 rounded-none border-1 gap-2 border-[#2a2a2a] bg-transparent"
              key={id}
            >
              <div className="flex gap-2">
                <Image
                  src={`/${item.imagepath}`}
                  height={100}
                  width={100}
                  alt={`img-${id}`}
                  className="border-1 border-[#2a2a2a] h-[50px] w-[50px] object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-[darkBlue] max-sm:text-[13px]">
                    {item.title}
                  </span>
                  <Link
                    href={item.link}
                    target="_blank"
                    className="text-[darkGreen] max-sm:text-[13px] w-fit flex items-center text-[14px] underline"
                  >
                    <Forward size={15} /> Verify
                  </Link>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: item.description }}
                className="text-[15px] text-justify font-normal max-sm:text-[13px]"
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Certifications;
