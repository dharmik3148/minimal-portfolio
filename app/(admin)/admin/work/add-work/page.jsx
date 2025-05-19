"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleXIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TagsInput } from "react-tag-input-component";

const Page = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [github, setGithub] = useState("");
  const [livedemo, setlivedemo] = useState("");

  const [tags, setTags] = useState([]);

  const router = useRouter();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrls((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!title || imageFiles.length === 0) {
      toast("Please provide a title and at least one image.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("details", details);
    formData.append("github", github);
    formData.append("livedemo", livedemo);
    formData.append("tags", tags);

    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const folder = "project";

      const res = await axios.post(`/api/work?folder=${folder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setDetails("");
      setGithub("");
      setlivedemo("");
      setImageFiles([]);
      setPreviewUrls([]);
      setIsLoading(false);

      toast(res.data.message);
      router.push("/admin/work");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast("Failed to save work. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col">
      <span>Add Work Page</span>
      <div className="flex">
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-blue-500">
              Title
            </label>
            <Input
              id="title"
              placeholder="Project title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="details" className="text-blue-500">
              Project Details
            </label>
            <textarea
              id="details"
              rows="5"
              className="border rounded-md px-2 py-1 resize-none"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-blue-500">Tags</label>
            <pre className="text-yellow-600">{JSON.stringify(tags)}</pre>
            <TagsInput
              value={tags}
              onChange={setTags}
              placeHolder="enter tags here..."
              separators={["Enter", "Tab", " "]}
              classNames={{
                input: "border rounded-md px-2 py-1 w-full text-white",
                tag: "text-gray-300 bg-red-500 px-2 py-1 rounded-full",
                tagRemoveIcon: "ml-1 text-red-500 cursor-pointer",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="github" className="text-blue-500">
              Github Link
            </label>
            <Input
              id="github"
              placeholder="Github URL..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="demo" className="text-blue-500">
              Live Demo
            </label>
            <Input
              id="demo"
              placeholder="Demo URL..."
              value={livedemo}
              onChange={(e) => setlivedemo(e.target.value)}
            />
          </div>
        </section>

        <section className="p-2 flex flex-col gap-2 w-1/2">
          <label htmlFor="images" className="text-blue-500">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border rounded-md p-2 cursor-pointer"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="w-fit h-40 relative">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-fit h-full object-contain border rounded-md bg-black"
                />
                <CircleXIcon
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full w-5 h-5"
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Button
        onClick={handleSave}
        className="mx-auto w-1/5 mt-4 bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </main>
  );
};

export default Page;
