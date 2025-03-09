/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios, { AxiosResponse } from "axios";
import { parseCookies } from "nookies";
import React, { createContext, useContext, useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthContextType {
  user: any;
  signin: (email: string, password: string) => Promise<AxiosResponse<any, any>>;
  signup: (email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  updateRefreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<any>(null);
  const [user, setUser] = useState();
  const signin = async (
    email: string,
    password: string
  ): Promise<AxiosResponse<any, any>> => {
    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      console.log(response.data);
      setAccessToken(response.data);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  const signup = async (email: string, password: string) => {
    try {
      const resposne = await axios.post("/api/auth/signup", {
        email,
        password,
      });
      console.log(resposne.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMe = async () => {
    await axios
      .get("/api/auth/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.response.user);
        console.log("SET_AUTH_USER: ", user);
      })
      .catch((err) => console.error(err));
  };
  const updateRefreshToken = async () => {
    try {
      const response = await axios.post("/api/auth/refresh");
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchMe();
  }, [accessToken]);
  return (
    <AuthContext.Provider
      value={{
        signin,
        signup,
        user,
        fetchMe,
        updateRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
