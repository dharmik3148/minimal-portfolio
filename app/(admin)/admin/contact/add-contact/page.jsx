"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();

  const [title, settitle] = useState("");
  const [value, setvalue] = useState("");
  const [iconname, seticonname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !value || !iconname) {
      toast("Each field required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `/api/contact`,
        { title, value, iconName: iconname },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status !== true) {
        toast(res.data.message);
        return;
      }

      toast(res.data.message);
      setIsLoading(false);
      router.push("/admin/contact");
      router.refresh();
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <main className="flex flex-col">
      <span>Add Contact Link Page</span>
      <div className="flex justify-center">
        <section className="p-2 flex flex-col gap-2 w-2/3">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-blue-500">
              Title
            </label>
            <Input
              id="title"
              placeholder="title..."
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="value" className="text-blue-500">
              href Value
            </label>
            <Input
              id="value"
              placeholder="mailto: , tel: ,etc."
              value={value}
              onChange={(e) => setvalue(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="iconname" className="text-blue-500">
              Icon Name
              <span className="text-red-500 text-[10px] block">
                use this site only :{" "}
                <Link
                  href={"https://lucide.dev/icons/"}
                  target="_blank"
                  className="text-green-500 underline"
                >
                  Lucide.dev
                </Link>
              </span>
            </label>
            <Input
              id="iconname"
              placeholder="only the name of icon..."
              value={iconname}
              onChange={(e) => seticonname(e.target.value)}
            />
          </div>
        </section>
      </div>
      <Button
        className="mx-auto w-1/5 mt-4 bg-green-600 hover:bg-green-700"
        disabled={isLoading}
        onClick={handleSave}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </main>
  );
};

export default page;
