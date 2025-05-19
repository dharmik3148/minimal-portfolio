import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const TechStack = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No TechStack</p>;
  }

  return (
    <section className="flex items-center justify-center py-5">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-5">
        <h3 className="text-4xl text-[darkBlue] font-normal tracking-tighter mb-6">
          Tech Stack
        </h3>

        {data?.map((item, id) => {
          return (
            <Card
              className="rounded-none bg-transparent border-1 gap-1 border-[#2a2a2a] p-2"
              key={id}
            >
              <span className="capitalize text-[darkBlue] border-b-1 border-[#2a2a2a]">
                {item.category}
              </span>

              <div className="flex flex-wrap">
                <TooltipProvider>
                  {item?.skills.map((skillImg, id) => {
                    return (
                      <Tooltip key={id}>
                        <TooltipTrigger>
                          <Image
                            src={`/${skillImg.logopath}`}
                            height={100}
                            width={100}
                            alt={`img-${id}`}
                            className="h-[35px] w-[35px] max-sm:h-[28px] max-sm:w-[28px] object-cover"
                          />
                          <TooltipContent className="rounded-none text-[darkOrange]">
                            <p>{skillImg.skillname}</p>
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default TechStack;
