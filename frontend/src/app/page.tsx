/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import TickMGif from "@/assets/gifs/tickmonitor.gif";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const checkMe = async () => {
    await axios
      .get("/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.response.user) {
          router.push("/dashboard/task");
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
    <div className="w-full h-screen flex items-center justify-center bg-slate-900">
      <div className="m-4 rounded-lg bg-slate-900 flex items-center justify-center">
        <Image src={TickMGif} alt="tickm-gif" />
      </div>
    </div>
  );
}
