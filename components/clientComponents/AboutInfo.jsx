import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const AboutInfo = ({ data }) => {
  if (data.length <= 0) {
    return <p className="text-red-500 text-center">No About Data</p>;
  }

  return (
    <section className="flex flex-col items-center justify-center py-[40px]">
      <div className="w-5/6 md:w-2/3 flex flex-col gap-5">
        <h3 className="text-4xl text-[darkBlue] font-normal tracking-tighter">
          About Me
        </h3>
        <Link
          href={data.resumepath}
          target="_blank"
          className="flex items-end justify-center gap-1 hover:text-[darkOrange] underline font-extrabold text-4xl w-fit bg-transperance rounded-none  text-[darkGreen] text-[20px]"
        >
          resume <ExternalLink size={18} />
        </Link>
        <span
          className="text-[16px] max-sm:text-[13px] font-normal"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </div>
    </section>
  );
};

export default AboutInfo;
