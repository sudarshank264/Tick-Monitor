"use client";

import { useUser } from "@/contexts/UserContext";
import { Notifications } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Appbar = () => {
  const user = useUser();
  return (
    <>
      <div
        className={`flex-grow h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white`}
      >
        <div>
          <div className="flex gap-1">
            Hi, <div className="font-bold text-green-800">{user?.current?.name.split(" ")[0]}</div>
          </div>
          <div className="text-xs font-light text-gray-400">
            Have a glance into your tasks!
          </div>
        </div>
        <div className="flex items-center gap-8">
          <IconButton sx={{ color: "#333333" }} size="small">
            <Notifications fontSize="small" sx={{ color: "#333333" }} />
          </IconButton>
          <div
            className={`w-8 h-8 bg-primary rounded-full cursor-pointer`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Appbar;
