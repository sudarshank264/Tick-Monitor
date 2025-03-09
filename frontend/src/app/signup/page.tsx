"use client";
import Image from "next/image";
import AbLogo from "@/assets/logos/tickmonitor.png";
import BgImage from "@/assets/images/bg.png";
import TextInput from "@/components/ui/form/TextInput";
import Button from "@/components/ui/form/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import useSnackbar from "@/lib/hooks/useSnackbar";

const Signup = () => {
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const handleAlreadyHaveAccount = () => {
    router.replace("/login");
  };
  const handleSubmit = async () => {
    if (password !== cPassword) {
      showSnackbar({
        key: "login_error_msg",
        text: "Password and Confirm Password Not Same",
        variant: "error",
      });
      return;
    }
    await axios
      .post("/api/auth/signup", { email, password })
      .then((res) => {
        const data = res.data;
        if (!data.success) {
          showSnackbar({
            key: "login_error_msg",
            text: data.message,
            variant: "error",
          });
          return;
        }
        showSnackbar({
          key: "login_success_msg",
          text: `Successfully Registered ${data.response.email}`,
          variant: "success",
        });
      })
      .catch((err) => {
        showSnackbar({
          key: "login_error_msg",
          text: "Error Logging In",
          variant: "error",
        });
      });
  };
  return (
    <>
      <div className=" w-full h-screen grid grid-cols-2 bg-white">
        <div className="p-4 flex flex-col items-center justify-bewteen flex-grow">
          <div className="w-full">1
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
                Welcome to{" "}
                <div className="font-bold text-3xl">Tick Monitor</div>
              </div>
            </div>
            <div className="w-full mt-4 px-4">
              <TextInput
                label="Email"
                hint="Enter you Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextInput
                className="mt-2"
                label="Password"
                hint="Enter your Password"
                inputProps={{
                  type: "password",
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextInput
                className="mt-2"
                label="Confirm Password"
                hint="Confirm your Password"
                inputProps={{
                  type: "password",
                }}
                value={cPassword}
                onChange={(e) => setCPassword(e.target.value)}
              />
              <div className="w-full flex justify-between px-1 py-2">
                <Button
                  variant="text"
                  label="Already have an account?"
                  onClick={handleAlreadyHaveAccount}
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4">
            <Button className="mt-8" label="Signup" onClick={handleSubmit} />
          </div>
        </div>
        <div className="m-4 rounded-lg bg-slate-900"></div>
      </div>
    </>
  );
};

export default Signup;
