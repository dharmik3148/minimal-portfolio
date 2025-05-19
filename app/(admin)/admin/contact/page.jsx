"use client";

import { Card } from "@/components/ui/card";
import axios from "axios";
import { PlusCircleIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const page = () => {
  const [data, setdata] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`/api/contact`, {
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

    const res = await axios.delete(`/api/contact?id=${id}`, {
      headers: { "Cache-Control": "no-store" },
    });

    if (res.data.status !== false) {
      toast(res.data.message);
      return;
    }

    toast(res.data.message);
    router.push("/admin/contact");
    router.refresh();
  };

  return (
    <main className="flex flex-col">
      <div className="flex">
        <Link
          href={"/admin/contact/add-contact"}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white py-2 px-5 rounded-md"
        >
          Add Contact Link <PlusCircleIcon size={20} />
        </Link>
      </div>

      {data.length <= 0 && (
        <span className="text-red-500 text-[20px] flex items-center justify-center mt-[150px]">
          No Data Found
        </span>
      )}

      <div className="mt-5 flex gap-4">
        {data.map((item, id) => {
          const Icon = LucideIcons[item.iconName];
          return (
            <Card className="rounded bg-transparent border p-0" key={id}>
              <div className="flex items-center justify-between p-3 gap-3">
                <div className="flex gap-2 items-center">
                  {Icon ? (
                    <Icon className="text-yellow-500" />
                  ) : (
                    <span className="text-yellow-500">⚠️</span>
                  )}
                  <span className="text-white">{item.value}</span>
                </div>
                <Button
                  onClick={() => deleteItem(item.id)}
                  className="flex items-center w-fit gap-1 py-1 px-2 rounded-md bg-red-900 hover:bg-red-600 text-red-300 hover:text-red-200"
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
