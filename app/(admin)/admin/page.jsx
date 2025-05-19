"use client";

import TextEditor from "@/components/adminComponents/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const page = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [h1, seth1] = useState("");
  const [h2, seth2] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [content, setContent] = useState("");

  const [musicPreview, setMusicPreview] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/homepage`, {
          headers: { "Cache-Control": "no-store" },
        });

        if (res.data.status !== true || !res.data.data) {
          toast(res.data.message || "Homepage data not found");
          setIsLoading(false);
          return;
        }

        const home = res.data.data;

        seth1(home.hone || "");
        seth2(home.htwo || "");
        setContent(home.content || "");
        setMusicPreview(home.musicpath || null);
        setResumePreview(home.resumepath || null);
        setImagePreview(home.imagepath || null);
      } catch (error) {
        toast("Failed to fetch homepage data.");
      } finally {
        setIsLoading(false);
        router.refresh();
      }
    };

    getData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "audio/mpeg") {
      setMusicFile(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setResumeFile(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();

    formData.append("hone", h1);
    formData.append("htwo", h2);
    formData.append("content", content);

    if (imageFile) {
      formData.append("imagepath", imageFile);
    }

    if (musicFile) {
      formData.append("musicpath", musicFile);
    }

    if (resumeFile) {
      formData.append("resumepath", resumeFile);
    }

    try {
      const folder = "homepage";
      const res = await axios.patch(
        `/api/homepage?folder=${folder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoading(false);
      toast(res.data.message);

      router.push(`/admin`);
      router.refresh();
    } catch (error) {
      toast("Failed to update homepage." + error.message);
    }
  };

  return (
    <main>
      <div className="flex">
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="h1-info" className="text-blue-500">
              h1 info
            </label>
            <Input
              id="h1-info"
              placeholder="h1 tag at homepage..."
              type="text"
              value={h1}
              onChange={(e) => seth1(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="h2-info" className=" text-blue-500">
              h2 info
            </label>
            <textarea
              id="h2-info"
              placeholder="h2 tag at homepage..."
              type="text"
              value={h2}
              onChange={(e) => seth2(e.target.value)}
              className="border-[2px] rounded-md resize-none p-2 outline-none"
              rows={5}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="muzik" className=" text-blue-500">
              Music
              <span className="text-red-500 text-[12px] block">
                only .mp3 file*
              </span>
            </label>
            <Input
              id="muzik"
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleMusicChange}
              className="cursor-pointer"
            />
            {musicFile ? (
              <audio controls className="mt-2">
                <source
                  src={URL.createObjectURL(musicFile)}
                  type="audio/mpeg"
                />
              </audio>
            ) : musicPreview ? (
              <audio controls className="mt-2">
                <source src={musicPreview} type="audio/mpeg" />
              </audio>
            ) : null}
          </div>
        </section>
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="dev-img" className=" text-blue-500">
              Dev Image
            </label>
            <Input
              id="dev-img"
              onChange={handleImageChange}
              className="cursor-pointer"
              type="file"
              accept="image/png, image/jpeg"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 border rounded"
                style={{
                  width: "fit-content",
                  height: "200px",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="resume" className=" text-blue-500">
              resume
            </label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeChange}
              className="cursor-pointer"
            />
            {resumeFile ? (
              <p className="text-sm text-green-500">
                Selected : {resumeFile.name}
              </p>
            ) : resumePreview ? (
              <a
                href={resumePreview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2a2a2a] px-3 py-1 rounded-2xl hover:font-bold bg-yellow-500 w-fit underline text-md"
              >
                View Existing Resume
              </a>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="muzik" className=" text-blue-500">
              About Me
            </label>
            <TextEditor content={content} setContent={setContent} />
          </div>
        </section>
      </div>
      <Button
        className="mx-auto w-1/5 flex mt-4 bg-green-600 hover:bg-green-700 cursor-pointer"
        onClick={handleUpdate}
      >
        {isLoading ? "Saving changes" : "Save changes"}
      </Button>
    </main>
  );
};

export default page;
