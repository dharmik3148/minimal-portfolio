"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { CircleXIcon, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [github, setGithub] = useState("");
  const [livedemo, setlivedemo] = useState("");
  const [tags, setTags] = useState("");
  const [images, setimages] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await axios.get(`/api/single-work/${id}`, {
        headers: { "Cache-Control": "no-store" },
      });

      const data = res.data.project;

      if (res.data.status !== true) {
        toast(res.data.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.refresh();
      setTitle(data.title);
      setDetails(data.details);
      setGithub(data.github);
      setlivedemo(data.livedemo);
      setTags(data.tags);
      setimages(data.images);

      if (res.data.project.tags) {
        setTags(res.data.project.tags.split(","));
      }
    };

    getData();
  }, [id]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", id);
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

      const res = await axios.patch(`/api/work?folder=${folder}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsLoading(false);
      toast(res.data.message);

      setImageFiles([]);
      setPreviewUrls([]);

      router.push(`/admin/work`);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast("Failed to save work. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`/api/work`, {
      headers: { imageid: id, "Cache-Control": "no-store" },
    });

    if (res.data.status !== true) {
      toast(res.data.message);
      return;
    }

    router.refresh();
    toast(res.data.message);
  };

  return (
    <main className="flex flex-col">
      <span>Edit Work Page</span>
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
            <label htmlFor="tags" className="text-blue-500">
              Tags
            </label>
            <pre className="text-yellow-600">{tags}</pre>
            <Input
              id="tags"
              placeholder="tags here with comma"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
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
          <label htmlFor="uploaded" className="text-blue-500">
            Already Uploaded Images
          </label>

          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((item, index) => (
              <div key={index} className="w-fit h-40 relative">
                <img
                  src={`/${item.path}`}
                  alt={`Preview ${index}`}
                  className="w-fit h-full object-contain border rounded-md bg-black"
                />
                <Trash2Icon
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full w-5 h-5 cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                />
              </div>
            ))}
          </div>
          <label htmlFor="images" className="text-blue-500">
            Upload New Images
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="border rounded-md p-2 cursor-pointer"
          />
          <div className="fl  ex flex-wrap gap-2 mt-2">
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
        onClick={handleUpdate}
        className="mx-auto w-1/3 md:w-1/5 mt-4 bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Save Changes"}
      </Button>
    </main>
  );
};

export default page;
