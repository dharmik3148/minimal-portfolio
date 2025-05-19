"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Image from "next/image";
import { Forward, MapPin } from "lucide-react";
import Link from "next/link";

const Experiences = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No Experience Data</p>;
  }

  return (
    <section className="flex items-center justify-center py-5">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-5">
        <h3 className="text-4xl text-[darkBlue] font-normal tracking-tighter mb-6">
          Journey
        </h3>

        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-2"
        >
          {data?.map((item, id) => {
            return (
              <AccordionItem value={`item-${id}`} key={id}>
                <AccordionTrigger className="relative border-1 flex items-center justify-between hover:no-underline border-[#2a2a2a] px-2 py-2 rounded-none">
                  <div className="flex items-center gap-2">
                    <Image
                      src={`/${item.image}`}
                      height={100}
                      width={100}
                      alt={`img-${id}`}
                      className="border-1 border-[#2a2a2a] h-[50px] w-[50px] object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-[darkBlue] text-[17px] max-sm:text-[13px]">
                        {item.organization}
                        {item.position != "" && item.position != undefined && (
                          <span className="text-[#2a2a2a] italic font-normal">
                            {` - ${item.position}`}
                          </span>
                        )}
                      </span>
                      <span className="font-normal text-[darkGreen] text-[13px] max-sm:text-[11px]">
                        {item.duration}
                      </span>
                    </div>
                    <span
                      className={`font-semiBold absolute left-[-27px] rotate-270
                        text-[darkBlack]
                      `}
                    >
                      {item.isWork ? "work" : "study"}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-l-1 border-r-1 border-b-1 border-[#2a2a2a] p-2">
                  <span className="flex items-center gap-1 font-normal text-[15px] max-sm:text-[13px]">
                    <MapPin size={15} />
                    {item.location}
                  </span>
                  <Link
                    href={item.link}
                    target="_blank"
                    className="flex items-center gap-1 font-normal text-blue-600 underline max-sm:text-[13px]"
                  >
                    <Forward size={15} />
                    {item.link}
                  </Link>
                  <h5 className="mt-4 text-[darkOrange]">Commitments :</h5>
                  <div
                    className="text-[15px] max-sm:text-[13px] font-normal"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};

export default Experiences;
