/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Appbar from "@/components/appbar/appbar";
import Drawer from "@/components/drawer/drawer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardTemplate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const checkMe = async () => {
    await axios
      .get("/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.response.user) {
          // router.push("/dashboard/task");
        } else {
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error(err);
        router.replace("/login");
      });
  };
  useEffect(() => {
    checkMe();
  }, []);
  return (
    <>
      <div className="flex h-screen">
        <Drawer />
        <div className="flex-grow bg-slate-50">
          <Appbar />
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardTemplate;
