"use client";

import Image from "next/image";
import TmLogo from "@/assets/logos/tickmonitor.png";
import BgImage from "@/assets/images/bg.png";
import TickMGif from "@/assets/gifs/tickmonitor.gif";
import TextInput from "@/components/ui/form/TextInput";
import Button from "@/components/ui/form/Button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSnackbar from "@/lib/hooks/useSnackbar";
import LoginLoader from "@/components/loaders/login-loader";
import { validateEmail } from "@/lib/utils/validators";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);
  const handleDontHaveAccountClick = () => {
    router.replace("/signup");
  };
  const handleForgotPassword = () => {
    router.replace("/forgot-password");
  };
  const handleSubmit = async () => {
    if (!email) {
      showSnackbar({
        key: "login_error_msg",
        text: "Enter your email",
        variant: "error",
      });
      return;
    }
    if (!validateEmail(email)) {
      showSnackbar({
        key: "login_error_msg",
        text: "Enter a valid email",
        variant: "error",
      });
      return;
    }
    if (!password) {
      showSnackbar({
        key: "login_error_msg",
        text: "Enter your password",
        variant: "error",
      });
      return;
    }

    await auth
      ?.signin(email, password)
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
          text: `Successfully Logged In as ${data.response.email}`,
          variant: "success",
        });
        router.replace("/dashboard/task");
      })
      .catch((err: any) => {
        showSnackbar({
          key: "login_error_msg",
          text: "Error Logging In",
          variant: "error",
        });
      });
  };
  if (loading) {
    return <LoginLoader loading={loading} />;
  }
  return (
    <>
      <div className=" w-full h-screen grid grid-cols-2 bg-white">
        <div className="p-4 flex flex-col items-center justify-bewteen flex-grow">
          <div className="w-full">
            <Image
              className="w-[17%] self-start justify-self-start animate-login-form-slide"
              src={TmLogo}
              alt="Ab-logo"
            />
          </div>
          <div className="w-full flex flex-grow flex-col justify-center animate-login-form-slide">
            <div className="flex flex-col items-center">
              <Image className="w-[30%]" src={BgImage} alt="Signup-bg" />
              <div className="mt-8 text-xl text-center">
                Welcome to
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{
                  type: "password",
                }}
              />
              <div className="w-full flex justify-between px-1 py-2">
                <Button
                  variant="text"
                  label="Don't have an account?"
                  onClick={handleDontHaveAccountClick}
                />
                <Button
                  variant="text"
                  label="Forgot Password?"
                  onClick={handleForgotPassword}
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4 animate-login-width-grow">
            <Button className="mt-8" label="Login" onClick={handleSubmit} />
          </div>
        </div>
        <div className="m-4 rounded-lg bg-slate-900 flex items-center justify-center">
          <Image src={TickMGif} alt="tickm-gif" />
        </div>
      </div>
    </>
  );
};

export default Login;
