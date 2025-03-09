"use client";

import AssignedTaskCard from "@/components/task/AssignedTaskCard";
import { LineBreak } from "@/components/ui/LineBeak";
import SectionHeading from "@/components/ui/SectionHeading";
import UserAvatar from "@/components/user/UserAvatar";
import { useTasks } from "@/contexts/TasksContext";
import { Add, CommentOutlined, List } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const Tasks = () => {
  const tasks = useTasks();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div
        style={{
          height: "calc(100vh - 5rem)",
        }}
        className="flex-col flex"
      >
        <div className="px-4 flex items-center justify-between text-2xl font-bold py-2 bg-blue-600">
          <div className="flex items-center justify-between gap-2 text-white">
            <List sx={{ color: "white" }} />
            Task List
          </div>
          <div>
            <IconButton
              sx={{ bgcolor: "white", "&:hover": { bgcolor: "whitesmoke" } }}
              onClick={() => {
                router.push("/dashboard/task/create");
              }}
            >
              <Add />
            </IconButton>
          </div>
        </div>
        <div className="flex">
          <div className="w-full">
            <div
              style={{
                height: "calc(100vh - 8rem)",
              }}
              ref={divRef}
              className="overflow-y-scroll pt-4"
            >
              <SectionHeading text="My Tasks" />
              <div className="flex flex-wrap m-4 gap-4">
                {tasks?.myTasksFiltered.map((t, index) => {
                  return (
                    <div
                      key={index}
                      className="flex shadow-sm flex-col border border-slate-200 rounded-md w-[48%] p-4 h-[270px] justify-between"
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-row gap-1">
                          {t.vertices.map((v, index) => (
                            <div
                              key={index}
                              className="text-xs px-2 h-6 flex items-center justify-center rounded-full bg-orange-600 text-white shadow-md"
                            >
                              {v.name}
                            </div>
                          ))}
                        </div>
                        <div className="font-bold mt-2">{t.title}</div>
                        <div className="text-slate-400 text-sm ">
                          {t.description}
                        </div>
                        <div className="flex flex-row gap-2 mt-4">
                          {t.assignedUsers.map((u, index) => (
                            <UserAvatar key={index} id={u.user.id} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div>
                          <LineBreak />
                          <div className="flex justify-end items-center mt-1 gap-2">
                            <IconButton>
                              <CommentOutlined />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div
              style={{
                height: "calc(100vh - 8rem)",
              }}
              className="overflow-y-scroll pt-4"
            >
              <SectionHeading text="Assigned Tasks" />
              <div className="flex flex-wrap mt-4 mx-4 gap-4">
                {tasks?.tasksByMeFiltered.map((t, index) => {
                  return <AssignedTaskCard t={t} key={index} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
