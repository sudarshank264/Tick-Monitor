import { MoreVert } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import DateFilter from "../menus/DateFilter";
import UrgencyFilter from "../menus/UrgencyFilter";
import ProjectsFilter from "../menus/ProjectsFilter";
import StatusFilter from "../menus/StatusFilter";
import { useTasks } from "@/contexts/TasksContext";
import { useDomain } from "@/contexts/DomainContext";

const TaskListHeaders = () => {
  // Dependencies
  const tasks = useTasks();
  const domain = useDomain();

  // Filter Elements
  const [dateFilterEl, setDateFilterEl] = useState<HTMLInputElement | null>(
    null
  );
  const [urgencyFilterEl, setUrgencyFilterEl] = useState<HTMLElement | null>(
    null
  );
  const [statusFilterEl, setStatusFilterEl] = useState<HTMLElement | null>(
    null
  );
  const [projectFilterEl, setProjectFilterEl] = useState<HTMLElement | null>(
    null
  );

  // Handle Filter Press
  const handleDateFilterPress = (e: any) => {
    setDateFilterEl(e.target as HTMLInputElement);
  };
  const handleUrgencyFilterPress = (e: any) => {
    setUrgencyFilterEl(e.currentTarget as HTMLElement);
  };
  const handleStatusFilterPress = (e: any) => {
    setStatusFilterEl(e.target as HTMLElement);
  };
  const handleProjectFilterPress = (e: any) => {
    setProjectFilterEl(e.target as HTMLElement);
  };

  // Close Filters
  const handleDateFilterClose = () => {
    setDateFilterEl(null);
  };
  const handleUrgencyFilterClose = () => {
    setUrgencyFilterEl(null);
  };
  const handleStatusFilterClose = () => {
    setStatusFilterEl(null);
  };
  const handleProjectFilterClose = () => {
    setProjectFilterEl(null);
  };
  return (
    <div className="flex flex-col mx-4 mt-4">
      <div
        className={`rounded-md w-full flex font-bold text-xs px-4 justify-between`}
      >
        <div className="w-[200px] flex items-center">
          <div>
            <div className="">Title</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="group flex w-[145px] items-center gap-1">
            Due Date
            <div className="invisible group-hover:visible scale-90">
              <IconButton
                onClick={handleDateFilterPress}
                sx={{ width: "30px", height: "30px" }}
                size="small"
              >
                <MoreVert fontSize="small" sx={{}} />
              </IconButton>
            </div>
          </div>
          <div className="w-[120px] flex items-center gap-1 group">
            Urgency
            <div className="invisible group-hover:visible scale-90">
              <IconButton
                onClick={handleUrgencyFilterPress}
                sx={{ width: "30px", height: "30px" }}
                size="small"
              >
                <MoreVert fontSize="small" sx={{}} />
              </IconButton>
            </div>
          </div>
          <div className="w-[120px] flex items-center gap-1 group">
            Status
            <div className="invisible group-hover:visible">
              <IconButton
                onClick={handleStatusFilterPress}
                sx={{ width: "30px", height: "30px" }}
                size="small"
              >
                <MoreVert fontSize="small" sx={{}} />
              </IconButton>
            </div>
          </div>
          <div className="flex items-center w-[120px] group gap-2">
            Project
            <div className="invisible group-hover:visible">
              <IconButton
                onClick={handleProjectFilterPress}
                sx={{ width: "30px", height: "30px" }}
                size="small"
              >
                <MoreVert fontSize="small" sx={{}} />
              </IconButton>
            </div>
          </div>
          <div className="w-[180px] text-center">People</div>
          <div className="w-[140px] text-center">Actions</div>
        </div>
      </div>
      <StatusFilter
        options={["To Initiate", "In Progress", "Completed", "On Hold"]}
        onClose={handleStatusFilterClose}
        anchRef={statusFilterEl}
        onChange={(curr, full) => {
          tasks?.addFilter({
            status: [
              "All",
              ...full.map((f) => f.replace(" ", "_").toLowerCase()),
            ],
          });
        }}
      />
      <ProjectsFilter
        options={domain?.verticals.map((v) => v.name) ?? []}
        onChange={(curr, full) => {
          tasks?.addFilter({
            verticals: ["All", ...full],
          });
        }}
        anchRef={projectFilterEl}
        onClose={handleProjectFilterClose}
      />
      <UrgencyFilter
        options={["Critical", "High", "Medium", "Low"]}
        onChange={(curr, full) => {
          tasks?.addFilter({
            urgency: ["All", ...full.map((f) => f.toLowerCase())],
          });
        }}
        anchRef={urgencyFilterEl}
        onClose={handleUrgencyFilterClose}
      />
      <DateFilter
        onChange={(curr, full) => {
          console.log(full);
          tasks?.addFilter({
            dueDate: ["All", ...full],
          });
        }}
        onClose={handleDateFilterClose}
        anchRef={dateFilterEl}
      />
    </div>
  );
};

export default TaskListHeaders;
