"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { EditIcon, PlusCircleIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [data, setdata] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`/api/work`, {
        headers: { "Cache-Control": "no-store" },
      });

      if (res.data.status !== true) {
        toast(res.data.message);
        return;
      }

      router.refresh();
      setdata(res.data.data);
    };

    getData();
  }, []);

  const deleteItem = async (id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this ?"
    );

    if (!userConfirmed) {
      toast("Item not deleted");
      return;
    }

    const res = await axios.delete(`/api/work-delete?id=${id}`, {
      headers: { "Cache-Control": "no-store" },
    });

    if (res.data.status !== false) {
      toast(res.data.message);
      return;
    }

    toast(res.data.message);
    router.push("/admin/work");
    router.refresh();
  };

  return (
    <main className="p-2">
      <div className="flex">
        <Link
          href={"/admin/work/add-work"}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white py-2 px-5 rounded-md"
        >
          Add Work <PlusCircleIcon size={20} />
        </Link>
      </div>

      {data.length <= 0 && (
        <span className="text-red-500 text-[20px] flex items-center justify-center mt-[150px]">
          No Data Found
        </span>
      )}

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, id) => {
          return (
            <Card
              key={id}
              className="p-3 flex flex-col gap-3 shadow-md rounded-md text-white bg-transparent"
            >
              {item.images.length > 0 ? (
                <img
                  src={`/${item.images[0].path}`}
                  alt="thumb-IMG"
                  className="w-full h-[200px] object-cover rounded-md"
                />
              ) : (
                <span className="text-red-500 text-center">
                  No Image Available
                </span>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
              <div className="flex justify-between gap-2 items-center">
                <Link
                  href={`/admin/work/edit-work/${item.id}`}
                  className="flex items-center gap-1 py-1 px-2 rounded-md bg-blue-900 hover:bg-blue-600 text-blue-300 hover:text-blue-200"
                >
                  <EditIcon size={16} /> Edit
                </Link>
                <Button
                  onClick={() => deleteItem(item.id)}
                  className="flex items-center gap-1 py-1 px-2 rounded-md bg-red-900 hover:bg-red-600 text-red-300 hover:text-red-200"
                >
                  <TrashIcon size={16} /> Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
};

export default page;
