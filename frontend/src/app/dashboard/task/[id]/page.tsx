"use client";

import { ArrowBack, Info } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

const TaskDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <>
      <div
        style={{
          height: "calc(100vh - 5rem)",
        }}
        className="flex-col flex"
      >
        <div className="px-4 flex items-center justify-between text-2xl font-bold py-2 bg-blue-600">
          <div className="flex items-center gap-2 text-white">
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBack sx={{ color: "white" }} />
            </IconButton>
            <Info sx={{ color: "white" }} />
            Task Details
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetails;
