/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { Task } from "@/lib/types/task.type";
import { Vertical } from "@/lib/types/vertical.type";

interface TasksContextType {
  myTasksFiltered: Task[];
  tasksByMeFiltered: Task[];
  syncTasks: () => Promise<void>;
  createTask: ({
    title,
    description,
    startDate,
    dueDate,
    startTime,
    dueTime,
    interval,
  }: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    startTime: string;
    dueTime: string;
    interval: Interval;
  }) => Promise<void>;
  addFilter: (filter: Partial<FilterCriteria>) => void;
  applySort: (sort: SortCriteria) => void;
}

const TasksContext = createContext<TasksContextType | null>(null);

type Interval = "DAILY" | "WEEKLY" | "MONTHLY" | "ANNUAL";
interface FilterCriteria {
  title: string;
  dueDate: string[];
  verticals: string[];
  status: string[];
  urgency: string[];
}

type SortCriteria = { key: keyof Task; order: "asc" | "desc" };

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [tasksByMe, setTasksByMe] = useState<Task[]>([]);
  const [myTasksFiltered, setMyTasksFiltered] = useState<Task[]>([]);
  const [tasksByMeFiltered, setTasksByMeFiltered] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterCriteria>({
    title: "",
    dueDate: ["All"],
    status: ["All"],
    urgency: ["All"],
    verticals: ["All"],
  });
  const [sort, setSort] = useState<SortCriteria>({
    key: "startDate",
    order: "asc",
  });

  const createTask = async ({
    title,
    description,
    startDate,
    dueDate,
    startTime,
    dueTime,
    interval,
  }: {
    title: string;
    description: string;
    startDate: string;
    dueDate: string;
    startTime: string;
    dueTime: string;
    interval?: Interval;
  }) => {
    try {
      const response = await axios.post("/api/tasks", {
        title,
        description,
        startDate,
        startTime,
        dueDate,
        dueTime,
        interval,
      });
      await syncTasks();
    } catch (err) {
      throw err;
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get(`/api/users/${auth?.user.sub}/tasks`);
      return response.data.response;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!auth?.user) return;
    getTasks().then((response) => {
      setMyTasks(response.assigned);
      setTasksByMe(response.assigns);
    });
  }, [auth?.user]);

  const syncTasks = async () => {
    getTasks().then((response) => {
      setMyTasks(response.assigned);
      setTasksByMe(response.assigns);
    });
  };

  useEffect(() => {
    if (!auth?.user) return;
    applyFilters();
  }, [myTasks, tasksByMe, filters]);

  const applyFilters = () => {
    let filteredTasks = myTasks;
    Object.entries(filters).forEach(([key, value]) => {
      console.log(key, value);
      if (key === "title") {
      } else {
        filteredTasks = filteredTasks.filter((t) => {
          if (key === "verticals") {
            return value.includes(t["vertices"][0].name);
          }
          if (key === "dueDate") {
            const date = new Date(t[key as keyof Task] as string);
            return value.includes(
              `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`
            );
          }
          return value.includes(t[key as keyof Task]);
        });
      }
    });
    let filteredTasksByMe = tasksByMe;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "title") {
        return;
      }
      value.forEach((v: string) => {
        if (v === "All") {
        } else
          filteredTasksByMe = filteredTasksByMe.filter((t) => {
            if (key === "verticals") {
              return value.includes(t["vertices"][0].name);
            }
            if (key === "dueDate") {
              const date = new Date(t[key as keyof Task] as string);
              console.log(
                `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
                  -2
                )}-${`0${date.getDate()}`.slice(-2)}`
              );

              return value.includes(
                `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
                  -2
                )}-${`0${date.getDate()}`.slice(-2)}`
              );
            }
            return value.includes(t[key as keyof Task]);
          });
      });
    });
    setMyTasksFiltered(filteredTasks);
    setTasksByMeFiltered(filteredTasksByMe);
  };

  const addFilter = (filter: Partial<FilterCriteria>) => {
    setFilters((prev) => {
      prev = { ...prev, ...filter };
      return prev;
    });
  };

  const applySort = (sort: SortCriteria) => {
    setSort(sort);
    const sortedTasks = [...myTasksFiltered].sort((a, b) => {
      if (a[sort.key] < b[sort.key]) return sort.order === "asc" ? -1 : 1;
      if (a[sort.key] > b[sort.key]) return sort.order === "asc" ? 1 : -1;
      return 0;
    });
    const sortedTasksByMe = [...tasksByMeFiltered].sort((a, b) => {
      if (a[sort.key] < b[sort.key]) return sort.order === "asc" ? -1 : 1;
      if (a[sort.key] > b[sort.key]) return sort.order === "asc" ? -1 : 1;
      return 0;
    });
    setMyTasksFiltered(sortedTasks);
    setTasksByMeFiltered(sortedTasksByMe);
  };

  return (
    <TasksContext.Provider
      value={{
        createTask,
        tasksByMeFiltered,
        myTasksFiltered,
        syncTasks,
        addFilter,
        applySort,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
