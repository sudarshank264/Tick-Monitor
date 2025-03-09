/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { TaskUser } from "@/lib/types/task-user.type";
import { getRandomColor } from "@/lib/utils/colors";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const UserAvatar = ({
  id,
  tUser,
  left,
}: {
  id?: string;
  tUser?: TaskUser;
  left?: string;
}) => {
  const [user, setUser] = useState<any>();
  const fetchUser = async () => {
    if (tUser) {
      setUser(tUser.user);
      return;
    }
    try {
      const response = await axios.get(`/api/users/${id}`);
      console.log(response.data.response);
      setUser(response.data.response);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  if (!user)
    return (
      <div className="relative flex items-center">
        <div className="absolute rounded-full w-7 h-7 bg-slate-800 text-white"></div>
      </div>
    );
  const color = getRandomColor(user.name);
  return (
    <div className="relative flex items-center">
      <Tooltip
        title={`${String(tUser?.role)[0].toLocaleUpperCase()}${String(
          tUser?.role
        ).substring(1)} ${user.name}`}
      >
        <div
          style={{
            left: left ?? 0,
          }}
          className={`absolute rounded-full flex items-center justify-center text-xs ${color} border border-white
        text-white w-7 h-7 shadow-md cursor-pointer transform transition-transform ease-out-cubic hover:scale-110 hover:z-10`}
        >
          {user.name[0] ?? ""}
        </div>
      </Tooltip>
    </div>
  );
};

export default UserAvatar;
