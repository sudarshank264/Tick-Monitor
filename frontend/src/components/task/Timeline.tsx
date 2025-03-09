/* eslint-disable react-hooks/exhaustive-deps */
import { useTasks } from "@/contexts/TasksContext";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

// 1.5rem 246px
const space = 60;

const Timeline = () => {
  const tasks = useTasks();
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [dates, setDates] = useState<Date[]>([]);
  const generateDates = (minDate: Date) => {
    let dates: Date[] = [];
    for (let i = 0; i <= 100; i++) {
      dates.push(new Date(minDate.getTime() + i * 1000 * 60 * 60 * 24));
    }
    setDates(dates);
  };
  useEffect(() => {
    if (tasks?.tasksByMeFiltered === null || !tasks?.tasksByMeFiltered.length)
      return;
    let calcMinDate = new Date(
      Math.min(
        ...tasks!.tasksByMeFiltered!.map((t) => new Date(t.startDate).getTime())
      )
    );
    setMinDate(calcMinDate);
    generateDates(calcMinDate);
    console.log(calcMinDate);
  }, [tasks]);
  if (minDate === null) return null;
  return (
    <div className="flex flex-col mx-4 mt-4 bg-white">
      <div
        className="flex flex-col overflow-x-scroll mt-2 px-4 relative"
        style={{ width: "calc(100vw - 246px - 2.5rem)" }}
      >
        <div className="flex">
          {dates.map((d, i) => {
            return (
              <div key={i} className={`flex text-xs border-b py-1 border-gray-100`}>
                <div
                  className="flex justify-center"
                  style={{ width: `${space}px` }}
                >
                  {d.toLocaleString("en-Us", {
                    day: "2-digit",
                    month: "short",
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute top-6">
          <div className="flex">
            {dates.map((d, i) => {
              return (
                <div key={i} className={`text-xs flex text-center`}>
                  <div
                    className="flex border-r border-gray-100"
                    style={{
                      width: `${space}px`,
                      height: "calc(100vh - 13.7rem)",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="" style={{ height: "calc(100vh - 13.7rem)" }}>
          <div className="flex flex-col relative">
            {tasks?.tasksByMeFiltered?.map((task, i) => {
              const duration =
                (new Date(task.dueDate).getTime() -
                  new Date(task.startDate).getTime()) /
                (1000 * 60 * 60 * 24);
              const shift =
                (new Date(task.startDate).getTime() - minDate!.getTime()) /
                (1000 * 24 * 60 * 60);
              return (
                <Tooltip placement="top" title={task.title} key={i}>
                  <div
                    className="flex items-center h-7 mt-4 px-2 bg-blue-600 rounded-lg cursor-pointer"
                    style={{
                      position: "relative",
                      left: `${shift * space}px`,
                      width: `${
                        space * (duration === 0 ? 0.5 : duration + 1)
                      }px`,
                    }}
                  >
                    <div className="text-white font-bold text-xs line-clamp-1 text-ellipsis">
                      {task.title}
                    </div>
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
