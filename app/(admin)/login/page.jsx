"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const [isLoading, setisLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    const userid = getCookie("userId");

    if (!token || !userid) {
      toast("Authorization failed");
      return;
    }
    console.log("ENTER");

    const auth = async () => {
      const res = await axios.get(`/api/auth`, {
        headers: { userid, token, "Cache-Control": "no-store" },
      });

      if (res.data.status !== true) {
        toast(res.data.message);
        return;
      }

      router.push("/admin");
      router.refresh();
      toast(res.data.message);
    };

    auth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setisLoading(true);

    const res = await axios.post(
      `/api/auth`,
      { username, password },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    if (res.data.status !== true) {
      toast(res.data.message);
      setisLoading(false);
      return;
    }

    const { id, token } = res.data;

    setCookie("token", token, { maxAge: 24 * 60 * 60 });
    setCookie("userId", id, { maxAge: 24 * 60 * 60 });

    router.push("/admin");
    router.refresh();
    toast(res.data.message);
    setisLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-[400px] mx-auto bg-transparent p-5 text-[#f5f5f5]">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <div className="">
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            value={username}
            className="mb-2"
            onChange={(e) => setusername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-green-800 text-white cursor-pointer hover:bg-green-700"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Card>
    </div>
  );
};

export default page;
