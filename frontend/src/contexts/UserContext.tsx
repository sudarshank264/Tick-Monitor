/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { Domain } from "@/lib/types/domain.type";
import { User } from "@/lib/types/user.type";
import { useDomain } from "./DomainContext";

interface UserContextType {
  current?: User;
  domains?: Domain[];
  fetchUserDetails: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const domain = useDomain();
  const [current, setCurrent] = useState<User | undefined>(undefined);

  const fetchUserDetails = async (id: string) => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      if (!response.data.success) {
        console.error(response.data);
        return;
      }
      return response.data.response;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!auth?.user) return;
    fetchUserDetails(auth.user?.sub).then((response) => {
      setCurrent(response);
      domain?.setDomains(response.domains);
      console.log("SET_CURRENT_USER: ", response);
    });
  }, [auth?.user]);
  return (
    <UserContext.Provider value={{ current, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
