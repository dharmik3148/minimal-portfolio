"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CircleXIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [skillName, setskillName] = useState("");
  const [category, setcategory] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [skills, setskills] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.put(`/api/skills`, {
        headers: { "Cache-Control": "no-store" },
      });

      if (res.data.status !== true) {
        return;
      }

      router.refresh();
      setskills(res.data.data);
    };

    getData();
  }, []);

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

    if (imageFiles.length == 0 || skillName === "" || category === "") {
      toast("Each field required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("skillname", skillName);
    formData.append("category", category);
    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const folder = "skills";
      const res = await axios.post(`/api/skills?folder=${folder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast(res.data.message);
      setIsLoading(false);
      router.push("/admin/skills");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast("Failed to save, Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col">
      <span>Add Skills Page</span>
      <div className="flex justify-center">
        <section className="p-2 flex flex-col gap-2 w-2/3">
          <div className="flex flex-col gap-2">
            <label htmlFor="skillnm" className="text-blue-500">
              Skill Name
            </label>
            <Input
              id="skillnm"
              placeholder="name here"
              value={skillName}
              onChange={(e) => setskillName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-blue-500">
              Category
            </label>
            <Input
              id="category"
              placeholder="category here"
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            />
            <div className="flex items-center p-2 gap-2">
              {skills &&
                skills.map((item, id) => {
                  return (
                    <Badge
                      key={id}
                      className={
                        "cursor-pointer bg-yellow-500 text-black hover:shadow-sm shadow-white"
                      }
                      onClick={() => setcategory(item)}
                    >
                      {item}
                    </Badge>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="skillimg" className="text-blue-500">
              Skill Image
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
                <div key={index} className="w-fit h-40 relative">
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
