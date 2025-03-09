/* eslint-disable react-hooks/exhaustive-deps */
import { urgencies } from "@/lib/utils/consts";
import UserAvatar from "../user/UserAvatar";
import {
  Add,
  ArrowForward,
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Task } from "@/lib/types/task.type";
import { useState } from "react";
import { useTasks } from "@/contexts/TasksContext";
import SubtaskList from "./SubtaskList";
import CreateSubTaskCard from "./CreateSubTaskCard";
import TaskDrawer from "./TaskDrawer";

const TaskRow = ({ t }: { t: Task }) => {
  const tasks = useTasks();
  const [showDetails, setShowDetails] = useState(false);
  const [expandSubs, setExpandSubs] = useState(false);
  const [expandSubTasks, setExpandSubTasks] = useState(false);
  const handleSubTaskCreateClose = () => {
    setExpandSubs(false);
  };
  const handleSubAdd = () => {
    setExpandSubs((prev) => !prev);
  };
  const handleAdd = async () => {
    await tasks?.syncTasks();
    handleSubAdd();
    handleSubTaskList();
  };
  const handleSubTaskList = () => {
    setExpandSubTasks((prev) => !prev);
  };
  const handleOpen = () => {
    setShowDetails(true);
  };
  const handleClose = () => {
    setShowDetails(false);
  };
  const getDescriptionText = () => {
    let desc: any;
    try {
      desc = JSON.parse(t.description);
      console.log("FFFFFF", desc);
    } catch {
      return "No description Available.";
    }
    if (!desc.content) {
      return "No description Available.";
    } else {
      return desc.content[0].content[0].text || "No descrption Available.";
    }
  };
  const recurseTillText = (obj: any) => {
    console.log(obj);

    return Object.keys(obj).includes("text")
      ? `${obj["text"]}`
      : obj["content"][0];
  };
  return (
    <div className={`bg-white flex w-full flex-col justify-center px-4 `}>
      <TaskDrawer t={t} open={showDetails} onClose={handleClose} />
      {/* :Row */}
      <div className="flex h-16 w-full items-center justify-between font-bold">
        <div className="w-[200px] text-sm">
          <div className="w-[180px] line-clamp-1 text-ellipsis">{t.title}</div>
          <div className="font-light w-[200px] text-slate-600 text-xs text-ellipsis line-clamp-1 ">
            {getDescriptionText()}
          </div>
        </div>

        <div className="flex items-center">
          {/* :Col2 */}
          <div className="w-[145px] font-[500] text-slate-500 text-xs">
            {new Date(t.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short",
            })}
          </div>
          {/* :Col3 */}
          <div className="w-[120px]">
            <div
              className="text-xs font-light items-center gap-1 h-7 w-24 flex justify-center rounded-md"
              style={{
                ...urgencies.filter((u) => u.value === t.urgency)[0].color,
              }}
            >
              <div className="scale-75">
                {urgencies.filter((u) => u.value === t.urgency)[0].icon}
              </div>
              {urgencies.filter((u) => u.value === t.urgency)[0].label}
            </div>
          </div>
          {/* :Col4 */}
          <div className="w-[120px] flex items-center">
            <div
              className={`font-normal relative capitalize flex items-center justify-center h-7 w-24 text-[12px] rounded-md border border-slate-600`}
            >
              {t.status === "in_progress" && t.subTasks.length !== 0 ? (
                <div
                  className={`absolute left-0 w-[${
                    (t.subTasks.filter((s) => s.status === "completed").length *
                      100) /
                    t.subTasks.length
                  }%] rounded-l-md h-7 bg-slate-600 opacity-20 z-100`}
                ></div>
              ) : null}
              {t.status === "in_progress" && t.subTasks.length !== 0
                ? `${
                    (t.subTasks.filter((s) => s.status === "completed").length *
                      100) /
                    t.subTasks.length
                  }%`
                : t.status.replace("_", " ")}
            </div>
          </div>
          <div className="w-[120px] flex">
            {t.vertices.length !== 0 ? (
              <div className="h-7 flex items-center justify-between text-xs rounded-full border text-[#13495b] border-slate-400">
                <div className="flex items-center">
                  <div className="mx-1 flex items-center rounded-full bg-slate-600 text-white justify-center w-5 h-5 text-xs">
                    {t.vertices[0].name[0]}
                  </div>
                  <div className="mr-2 text-ellipsis text-nowrap line-clamp-1">
                    {t.vertices[0].name}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex w-[180px] items-center justify-center">
            <UserAvatar
              tUser={{
                id: t.assignedBy.id,
                role: "assigne",
                user: t.assignedBy,
              }}
              left={`-30px`}
            />
            <ArrowForward fontSize="small" sx={{ color: "gray" }} />
            {t.assignedUsers.slice(0, 3).map((u, index) =>
              index < 2 || (index === 2 && t.assignedUsers.length === 3) ? (
                <UserAvatar
                  key={index}
                  tUser={t.assignedUsers[index]}
                  id={u.user.id}
                  left={`${index * 17}px`}
                />
              ) : (
                <div key={index} className="relative flex items-center">
                  <Tooltip title={`${u.role} ${u.user.name} & Others`}>
                    <div
                      style={{
                        left: `${index * 17}px`,
                      }}
                      className={`absolute rounded-full flex items-center justify-center text-xs bg-gray-500 border border-white
              text-white w-7 h-7 shadow-md cursor-pointer transform transition-transform ease-out-cubic hover:scale-110 hover:z-10`}
                    >
                      +{t.assignedUsers.length - 3}
                    </div>
                  </Tooltip>
                </div>
              )
            )}
          </div>
          <div className="flex gap-2 w-[140px]">
            <IconButton onClick={handleSubAdd}>
              <Add sx={{ color: "#1e293b" }} />
            </IconButton>
            <IconButton onClick={handleOpen}>
              <InfoOutlined sx={{ color: "#1e293b" }} />
            </IconButton>
            <IconButton onClick={handleSubTaskList} sx={{ color: "#1e293b" }}>
              {expandSubTasks ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </div>
        </div>
      </div>

      {/* :Subtasks */}

      <CreateSubTaskCard
        t={t}
        showDialog={expandSubs}
        handleClose={handleSubTaskCreateClose}
        onAdd={handleAdd}
      />
      {expandSubTasks && <SubtaskList t={t} />}

      <div className="border-b"></div>
    </div>
  );
};

export default TaskRow;
