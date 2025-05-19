"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { GitBranch, Link2 } from "lucide-react";
import { Button } from "../ui/button";

const Projects = ({ data }) => {
  const isMobile = useIsMobile();

  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No Projects</p>;
  }

  return (
    <section className="flex items-center justify-center py-5">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-5">
        <h3 className="text-4xl text-[darkBlue] font-normal tracking-tighter mb-6">
          Work
        </h3>

        <div className="flex relative justify-center">
          <Swiper
            slidesPerView={isMobile ? 1 : 3}
            spaceBetween={7}
            pagination={{
              type: "fraction",
              el: ".custom-pagination",
            }}
            modules={[Pagination]}
            className="mySwiper w-full relative"
          >
            {data?.map((item, id) => {
              const tags = item.tags.split(",");

              return (
                <SwiperSlide
                  key={id}
                  className="flex flex-col justify-start h-fit min-h-[400px] p-2 border border-[#2a2a2a] overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={7}
                    pagination={{
                      clickable: true,
                      el: `.inner-image-pagi-${id}`,
                    }}
                    modules={[Pagination]}
                    className="mySwiper w-full relative"
                  >
                    {item.images.map((img, id) => {
                      return (
                        <SwiperSlide key={id}>
                          <div className="relative w-full h-[180px] mb-2">
                            <Image
                              src={`/${img.path}`}
                              alt={`img-${id}`}
                              fill={true}
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                  <div
                    className={`inner-image-pagi inner-image-pagi-${id} flex justify-center mt-[2px]`}
                  ></div>

                  <span className="text-[18px] text-[darkBlue] mt-1 font-semibold line-clamp-1">
                    {item.title}
                  </span>

                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.livedemo && (
                      <Badge className="rounded-none bg-transparent p-0 text-[darkBlack] border border-[darkGreen]">
                        <Link
                          href={item.livedemo}
                          target="_blank"
                          className="flex items-center gap-1 py-[3px] px-[7px] text-[darkGreen]"
                        >
                          <Link2 size={15} /> Live Demo
                        </Link>
                      </Badge>
                    )}
                    {item.github && (
                      <Badge className="rounded-none bg-transparent p-0 text-[darkBlack] border border-[darkGreen]">
                        <Link
                          href={item.github}
                          target="_blank"
                          className="flex items-center gap-1 py-[3px] px-[7px] text-[darkGreen]"
                        >
                          <GitBranch size={15} /> GitHub
                        </Link>
                      </Badge>
                    )}
                  </div>

                  <section className="flex flex-col">
                    <div className="flex flex-wrap gap-1 my-2">
                      {tags.map((tag, id) => (
                        <Badge
                          key={id}
                          className="rounded-none bg-transparent text-[darkBlack] border border-[#2a2a2a]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-[15px] max-sm:text-[13px] font-normal text-justify">
                      {item.details}
                    </div>
                  </section>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="custom-pagination flex mx-auto justify-center !text-[darkBlue] font-serif"></div>
      </div>
    </section>
  );
};

export default Projects;
