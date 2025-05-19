"use client";

import {
  CodeXml,
  GraduationCap,
  Home,
  Link2,
  Scroll,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Work",
    url: "/admin/work",
    icon: CodeXml,
  },

  {
    title: "Experience",
    url: "/admin/experience",
    icon: GraduationCap,
  },

  {
    title: "Achivements",
    url: "/admin/achivements",
    icon: Scroll,
  },
  {
    title: "Tech Skills",
    url: "/admin/skills",
    icon: Sparkles,
  },
  {
    title: "Contact Links",
    url: "/admin/contact",
    icon: Link2,
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getCookie("token");
    const userid = getCookie("userId");

    if (!token || !userid) {
      toast("Authorization failed");
      return;
    }

    const res = await axios.delete(`/api/auth`, {
      headers: { "Cache-Control": "no-store" },
      data: { token, userId: parseInt(userid) },
    });

    if (res.data.status === false) {
      toast(res.data.message);
      return;
    }

    deleteCookie("token");
    deleteCookie("userId");

    router.push("/admin/login");
    router.refresh();
    toast(res.data.message);
  };

  return (
    <Sidebar className="h-full">
      <SidebarContent className="bg-[#2a2a2a] text-[#f5f5f5] border-r-[1px] border-[#f5f5f5] flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-[#f5f5f5] m-1 text-[#2a2a2a] flex justify-center text-[20px]">
            Portfolio Admin
          </SidebarGroupLabel>
          <SidebarGroupContent className="my-1">
            <SidebarMenu className="flex gap-3 px-1 mt-2 flex-col">
              {items.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? pathname === item.url
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem
                    key={item.title}
                    className={`w-full border-[2px] rounded-md overflow-hidden ${
                      isActive
                        ? "border-red-500 text-red-500"
                        : "border-[#f5f5f5]"
                    }`}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={`flex items-center rounded-none gap-2 ${
                          isActive ? "text-red-500" : "text-white"
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Button
          onClick={handleSubmit}
          className="bg-red-600 m-3 hover:bg-red-500 cursor-pointer text-white mt-auto"
        >
          Logout
        </Button>
      </SidebarContent>
    </Sidebar>
  );
}
