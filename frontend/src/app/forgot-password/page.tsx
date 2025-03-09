"use client";

import Image from "next/image";
import AbLogo from "@/assets/logos/tickmonitor.png";
import BgImage from "@/assets/images/bg.png";
import TextInput from "@/components/ui/form/TextInput";
import { useState } from "react";
import Button from "@/components/ui/form/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  return (
    <>
      <div className=" w-full h-screen grid grid-cols-2 bg-white">
        <div className="p-4 flex flex-col items-center justify-bewteen flex-grow">
          <div className="w-full">
            <Image
              className="w-[20%] self-start justify-self-start"
              src={AbLogo}
              alt="Ab-logo"
            />
          </div>
          <div className="w-full flex flex-grow flex-col justify-center">
            <div className="flex flex-col items-center">
              <Image className="w-[30%]" src={BgImage} alt="Signup-bg" />
              <div className="mt-8 text-xl text-center">
                Forgot password?{" "}
                <div className="font-bold text-3xl">We Got You</div>
              </div>
            </div>

            <div className="w-full mt-4 px-4">
              <div className="text-sm px-1 py-2">
                We will send an OTP to your email.
              </div>
              <TextInput
                label="Email"
                hint="Enter your Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full px-4">
            <Button className="mt-8" label="Send OTP" />
          </div>
        </div>
        <div className="m-4 rounded-lg bg-slate-900"></div>
      </div>
    </>
  );
};

export default ForgotPassword;
