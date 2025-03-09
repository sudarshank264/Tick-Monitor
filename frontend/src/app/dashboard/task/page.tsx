"use client";

import CreateTaskCard from "@/components/task/CreateTaskCard";
import TaskListHeaders from "@/components/task/TaskListHeaders";
import TaskRow from "@/components/task/TaskRow";
import Timeline from "@/components/task/Timeline";
import { useTasks } from "@/contexts/TasksContext";
import { AddBox } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

const Tasks = () => {
  const tasks = useTasks();
  const [selectedTab, setSelectedTab] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const handleCreateNav = () => {
    setShowCreateDialog(true);
  };
  const handleClose = () => {
    setShowCreateDialog(false);
  };
  return (
    <>
      <CreateTaskCard
        showCreateDialog={showCreateDialog}
        handleClose={handleClose}
      />
      <div
        style={{
          height: "calc(100vh - 4rem)",
        }}
        className={`flex-col flex`}
      >
        <div
          className={`px-4 h-12 pt-4 bg-white flex items-center text-2xl font-bold gap-1`}
        >
          Tasks
          <IconButton size="small" onClick={handleCreateNav}>
            <AddBox className="text-gray-300" fontSize="medium" />
          </IconButton>
        </div>
        <div
          className={`px-4 pt-2 pb-2 bg-white flex items-center gap-2 text-xs`}
        >
          <div
            className={`h-6 cursor-pointer hover:bg-slate-50 flex items-center justify-center px-4 rounded ${
              selectedTab === 0 ? "bg-slate-100 text-blue-800" : ""
            }`}
            onClick={() => setSelectedTab(0)}
          >
            Board
          </div>
          <div
            className={`h-6 cursor-pointer hover:bg-slate-50 flex items-center justify-center px-4 rounded  ${
              selectedTab === 1 ? "bg-slate-100 text-blue-800" : ""
            }`}
            onClick={() => setSelectedTab(1)}
          >
            Timeline
          </div>
          <div
            className={`h-6 cursor-pointer hover:bg-slate-50 flex items-center justify-center px-4 rounded  ${
              selectedTab === 2 ? "bg-slate-100 text-blue-800" : ""
            }`}
            onClick={() => setSelectedTab(2)}
          >
            Activities
          </div>
        </div>
        {selectedTab === 0 && (
          <>
            <TaskListHeaders />
            <div
              className={`flex flex-col overflow-y-scroll`}
              style={{
                height: "calc(100vh - 2rem)",
              }}
            >
              <div className="flex flex-col mx-4 mt-2">
                <div className="mt-1">
                  {tasks?.tasksByMeFiltered.map((t, index) => {
                    return <TaskRow key={index} t={t} />;
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        {selectedTab === 1 && (
          <>
            <Timeline />
          </>
        )}
      </div>
    </>
  );
};

export default Tasks;
