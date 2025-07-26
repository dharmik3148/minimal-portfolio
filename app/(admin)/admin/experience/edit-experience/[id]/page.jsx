"use client";

import TextEditor from "@/components/adminComponents/TextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { CircleXIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [organisation, setorganisation] = useState("");
  const [link, setlink] = useState("");
  const [isWork, setisWork] = useState(true);
  const [Position, setPosition] = useState("");
  const [duration, setduration] = useState("");
  const [location, setlocation] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [img, setimg] = useState("");

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const res = await axios.get(`/api/single-experience/${id}`, {
        headers: { "Cache-Control": "no-store" },
      });

      if (res.data.status !== true) {
        toast(res.data.message);
        setIsLoading(false);
        return;
      }
      const exp = res.data.data;
      setorganisation(exp.organization);
      setlink(exp.link);
      setisWork(exp.isWork);
      setduration(exp.duration);
      setPosition(exp.position);
      setlocation(exp.location);
      setContent(exp.description);
      setimg(exp.image);

      setIsLoading(false);
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
    formData.append("organization", organisation);
    formData.append("link", link);
    formData.append("isWork", isWork.toString());
    formData.append("position", Position);
    formData.append("duration", duration);
    formData.append("location", location);
    formData.append("description", content);

    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const folder = "experience";

      const res = await axios.patch(
        `/api/experience?folder=${folder}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoading(false);
      toast(res.data.message);

      setImageFiles([]);
      setPreviewUrls([]);

      router.push(`/admin/experience`);
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
      <span>Edit Experience Page</span>
      <div className="flex">
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <div className="flex flex-col gap-2">
            <label htmlFor="orgName" className="text-blue-500">
              Organization's Name
            </label>
            <Input
              id="orgName"
              placeholder="org. / company name"
              value={organisation}
              onChange={(e) => setorganisation(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="orgLink" className="text-blue-500">
              Link
            </label>
            <Input
              id="orgLink"
              placeholder="https://company-name.com"
              value={link}
              onChange={(e) => setlink(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-blue-500">Select Type</label>

            <div className="flex items-center gap-2">
              <Switch
                id="work-mode"
                checked={isWork}
                onCheckedChange={setisWork}
              />
              <label htmlFor="work-mode">{isWork ? "Work" : "Study"}</label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="position" className="text-blue-500">
              Position
            </label>
            <Input
              id="position"
              placeholder="position/title"
              value={Position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="duration" className="text-blue-500">
              Duration
            </label>
            <Input
              id="duration"
              placeholder="MM - YYYY"
              value={duration}
              onChange={(e) => setduration(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="location" className="text-blue-500">
              Location
            </label>
            <Input
              id="location"
              placeholder="where you based at"
              value={location}
              onChange={(e) => setlocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="uploaded" className="text-blue-500">
              Already Uploaded Images
            </label>

            <img
              src={`/${img}`}
              alt={`Preview Exp`}
              className="w-fit h-[100px] object-contain cursor-not-allowed border rounded-md bg-black"
            />
            {/* BREAK SECTION */}
            <label htmlFor="images" className="text-blue-500">
              Upload New Image
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
                <div className="w-fit h-40 relative" key={index}>
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
        <section className="p-2 flex flex-col gap-2 w-1/2">
          <label htmlFor="description" className="text-blue-500">
            Description
          </label>

          <TextEditor content={content} setContent={setContent} />
        </section>
      </div>
      <Button
        className="mx-auto w-1/5 mt-4 bg-green-600 hover:bg-green-700"
        disabled={isLoading}
        onClick={handleUpdate}
      >
        {isLoading ? "Saving Changes..." : "Save Changes"}
      </Button>
    </main>
  );
};

export default page;
