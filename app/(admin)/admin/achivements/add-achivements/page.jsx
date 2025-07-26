"use client";

import TextEditor from "@/components/adminComponents/TextEditor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CircleXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFiles([file]);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrls([reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!title || imageFiles.length === 0 || imageFiles.length > 1) {
      toast("Each field required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("date", date.toISOString());
    formData.append("description", content);

    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const folder = "achivements";
      const res = await axios.post(
        `/api/achivements?folder=${folder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast(res.data.message);
      setIsLoading(false);
      router.push("/admin/achivements");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast("Failed to save, Please try again." + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col">
      <span>Add Achivement Page</span>
      <div className="flex">
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="achiveName" className="text-blue-500">
              Title
            </label>
            <Input
              id="achiveName"
              placeholder="name here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="link" className="text-blue-500">
              Link
            </label>
            <Input
              id="link"
              placeholder="https://link here..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="achiveImg" className="text-blue-500">
              Upload an Image
              <span className="text-red-500 text-[10px] block">
                1 image allowed*
              </span>
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-md p-2 cursor-pointer"
              disabled={previewUrls.length >= 1}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="w-fit h-fit relative">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-fit h-[100px] object-contain border rounded-md bg-black"
                  />
                  <CircleXIcon
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full w-5 h-5"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="data" className="text-blue-500">
              Date
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-fit"
            />
          </div>
        </section>
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-blue-500">
              Description
            </label>

            <TextEditor content={content} setContent={setContent} />
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
