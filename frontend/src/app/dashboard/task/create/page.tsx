"use client";

import Editor from "@/components/editor/editor";
import AutofillInput from "@/components/ui/form/AutofillInput";
import Button from "@/components/ui/form/Button";
import DateInput from "@/components/ui/form/DateInput";
import { LineBreak } from "@/components/ui/LineBeak";
import MultilineInput from "@/components/ui/form/MultilineInput";
import TextInput from "@/components/ui/form/TextInput";
import { useAuth } from "@/contexts/AuthContext";
import { useDomain } from "@/contexts/DomainContext";
import { Comment } from "@/lib/types/comment-app.type";
import { getDateTime } from "@/lib/utils/datetimeUtils";
import {
  Add,
  Attachment,
  Business,
  Campaign,
  Cancel,
  Comment as CommentIcon,
  DateRange,
  InfoOutlined,
  People,
  Send,
} from "@mui/icons-material";
import {
  Avatar,
} from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks } from "@/contexts/TasksContext";
import { urgencies } from "@/lib/utils/consts";
import { formatSizeInBytes } from "@/lib/utils/fileSize";

type RecurralIntervalType = "daily" | "weekly" | "monthly" | "annual";

const CreateTask = () => {
  const auth = useAuth();
  const domain = useDomain();
  const router = useRouter();
  const tasks = useTasks();
  const [isRecurral, setIsRecurral] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2); // Months are 0-based in JavaScript
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  });
  const [endTime, setEndTime] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [urgency, setUrgency] = useState("");
  const [recurralInterval, setRecurralInterval] =
    useState<RecurralIntervalType>("daily");
  const divRef = useRef<HTMLDivElement | null>(null);
  const submitTask = async () => {
    await axios
      .post("/api/tasks/", {
        title: title,
        description: desc,
        assignedBy: auth?.user.sub,
        assignedUsers: [
          ...to.map((t) => ({
            id: t,
            role: "to",
          })),
          ...cc.map((c) => ({
            id: c,
            role: "cc",
          })),
        ],
        vertices: selectedVerticals,
        interval: isRecurral ? recurralInterval : "none",
        startDate: getDateTime(startDate),
        dueDate: getDateTime(endDate),
        urgency: urgency,
      })
      .then(async (res) => {
        await tasks?.syncTasks();
        router.back();
      })
      .catch((err) => err);
  };
  return (
    <>
      <div
        style={{
          height: "calc(100vh - 6rem)",
        }}
        className="flex-col flex"
      >
        <div className="flex">
          <div className="flex-grow">
            <div
              ref={divRef}
              style={{
                height: "calc(100vh - 6.5rem)",
              }}
              className="overflow-y-scroll pt-2"
            >
              {/* :Details */}
              <div className="flex flex-col mx-4 mt-4">
                <div className="flex font-bold items-center gap-1">
                  <InfoOutlined fontSize="small" /> Details
                </div>
                <LineBreak className="mt-1" />
              </div>
              <div className="mx-4 mt-4">
                <TextInput
                  label="Title *"
                  hint="Enter Title"
                  style={{
                    fontSize: 14,
                  }}
                  className="text-2xl"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mx-4 mt-2">
                <MultilineInput
                  label="Description *"
                  hint="Describe your Task"
                  inputClassName="h-[50px]"
                  style={{
                    fontSize: 14,
                    paddingTop: "0.3em",

                    resize: "none",
                  }}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className=""
                />
              </div>

              {/* :People */}
              <div className="flex flex-col mx-4 mt-4">
                <div className="flex font-bold items-center gap-1">
                  <People fontSize="small" /> People
                </div>
                <LineBreak className="mt-1" />
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <div className="mx-4 mt-4">
                    <AutofillInput
                      label="To *"
                      parentRef={divRef}
                      maxItems={1}
                      hint="Mention Assignee to this Task"
                      renderSelected={(sel, removeItem, idx) => (
                        <div
                          key={idx}
                          className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                        >
                          <div className="flex items-center">
                            <Avatar className="mx-1 w-5 h-5 text-xs">
                              {sel.name[0]}
                            </Avatar>
                            <div className="mr-2">{sel.name}</div>
                          </div>
                          <Cancel
                            className="w-6 h-6 cursor-pointer mr-[0.125em]"
                            onClick={() => removeItem(sel.id)}
                          />
                        </div>
                      )}
                      renderAutofillItem={(
                        item,
                        highlighted,
                        selectItem,
                        index
                      ) => (
                        <div
                          key={index}
                          onClick={() => {
                            console.log("SELECTED: ", index);
                            selectItem(index);
                          }}
                          className={`flex gap-2 p-2 hover:bg-slate-400 cursor-pointer ${
                            highlighted
                              ? "bg-slate-400 border-l-2 border-slate-800"
                              : "bg-white"
                          }`}
                        >
                          <Avatar>{item.name[0]}</Avatar>
                          <div className={`text-sm font-bold`}>
                            {item.name}
                            <div className="text-xs font-normal">
                              {item.domain}
                            </div>
                          </div>
                        </div>
                      )}
                      options={
                        domain?.users
                          .filter((u) => !to.includes(u.id))
                          .map((u) => ({ ...u, domain: "OAB" })) ?? []
                      }
                      searchMapper={(p: any) => p.name}
                      onChange={(curr, full) => setTo(full.map((t) => t.id))}
                    />
                  </div>
                </div>
                <div>
                  <div className="mr-4 mt-4">
                    <AutofillInput
                      parentRef={divRef}
                      label="Cc *"
                      hint="Mention Ccs to this Task"
                      renderSelected={(sel, removeItem, idx) => (
                        <div
                          key={idx}
                          className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                        >
                          <div className="flex items-center">
                            <Avatar className="mx-1 w-5 h-5 text-xs">
                              {sel.name[0]}
                            </Avatar>
                            <div className="mr-2">{sel.name}</div>
                          </div>
                          <Cancel
                            className="w-6 h-6 cursor-pointer mr-[0.125em]"
                            onClick={() => removeItem(sel.id)}
                          />
                        </div>
                      )}
                      renderAutofillItem={(
                        item,
                        highlighted,
                        selectItem,
                        index
                      ) => (
                        <div
                          key={index}
                          onClick={() => {
                            console.log("CLICKING");
                            selectItem(index);
                          }}
                          className={`flex gap-2 p-2 hover:bg-slate-400 cursor-pointer ${
                            highlighted
                              ? "bg-slate-400 border-l-2 border-slate-800"
                              : "bg-white"
                          }`}
                        >
                          <Avatar>{item.name[0]}</Avatar>
                          <div className={`text-sm font-bold`}>
                            {item.name}
                            <div className="text-xs font-normal">
                              {item.domain}
                            </div>
                          </div>
                        </div>
                      )}
                      options={
                        domain?.users
                          .filter((u) => !cc.includes(u.id))
                          .map((u) => ({ ...u, domain: "OAB" })) ?? []
                      }
                      searchMapper={(p) => p.name}
                      onChange={(curr, full) => {
                        console.log(curr, full);
                        setCc(full.map((c) => c.id));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* :Business */}
              <div className="grid grid-cols-2">
                <div>
                  <div className="flex flex-col mx-4 mt-4">
                    <div className="flex font-bold items-center gap-1">
                      <Business fontSize="small" /> Business
                    </div>
                    <LineBreak className="mt-1" />
                  </div>
                  <div className="mx-4 mt-2">
                    <AutofillInput
                      parentRef={divRef}
                      maxItems={1}
                      label="Business *"
                      hint="Mention Businesses involved this Task"
                      renderSelected={(sel, removeItem, idx) => (
                        <div
                          key={idx}
                          className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                        >
                          <div className="flex items-center">
                            <Avatar className="mx-1 w-5 h-5 text-xs">
                              {sel.name[0]}
                            </Avatar>
                            <div className="mr-2">{sel.name}</div>
                          </div>
                          <Cancel
                            className="w-6 h-6 cursor-pointer mr-[0.125em]"
                            onClick={() => removeItem(sel.id)}
                          />
                        </div>
                      )}
                      renderAutofillItem={(
                        item,
                        highlighted,
                        selectItem,
                        index
                      ) => (
                        <div
                          key={index}
                          onClick={() => selectItem(index)}
                          className={`flex gap-2 p-2 hover:bg-slate-400 cursor-pointer ${
                            highlighted
                              ? "bg-slate-400 border-l-2 border-slate-800"
                              : "bg-white"
                          }`}
                        >
                          <Avatar>{item.name[0]}</Avatar>
                          <div className={`text-sm font-bold`}>
                            {item.name}
                            <div className="text-xs font-normal">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      )}
                      options={domain?.verticals ?? []}
                      searchMapper={(p) => p.name}
                      onChange={(curr, full) =>
                        setSelectedVerticals(full.map((v) => v.id))
                      }
                    />
                  </div>
                </div>

                {/* :Urgency */}
                <div>
                  <div className="flex flex-col mr-4 mt-4">
                    <div className="flex font-bold items-center gap-1">
                      <Campaign fontSize="small" /> Urgency
                    </div>
                    <LineBreak className="mt-1" />
                  </div>
                  <div className="mr-4 mt-2">
                    <AutofillInput
                      parentRef={divRef}
                      maxItems={1}
                      label="Urgency *"
                      hint="How urgent is your Task?"
                      renderSelected={(sel, removeItem, idx) => (
                        <div
                          key={idx}
                          className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                        >
                          <div className="flex items-center">
                            <div className="mx-1">{sel.icon}</div>
                            <div className="mr-2">{sel.label}</div>
                          </div>
                          <Cancel
                            className="w-6 h-6 cursor-pointer mr-[0.125em]"
                            onClick={() => removeItem(sel.id)}
                          />
                        </div>
                      )}
                      renderAutofillItem={(
                        item,
                        highlighted,
                        selectItem,
                        index
                      ) => (
                        <div
                          key={index}
                          onClick={() => selectItem(index)}
                          className={`flex gap-2 p-2 hover:bg-slate-400 cursor-pointer items-center ${
                            highlighted
                              ? "bg-slate-400 border-l-2 border-slate-800"
                              : "bg-white"
                          }`}
                        >
                          {item.icon}
                          <div className={`text-sm font-bold`}>
                            {item.label}
                            <div className="text-xs font-normal">
                              {item.label}
                            </div>
                          </div>
                        </div>
                      )}
                      options={urgencies}
                      searchMapper={(p) => p.label}
                      onChange={(curr, full) => {
                        setUrgency(curr.value);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* :Timeline */}
              <div className="flex flex-col mx-4 mt-4">
                <div className="flex font-bold items-center gap-1">
                  <DateRange fontSize="small" /> Timeline
                </div>
                <LineBreak className="mt-1" />
              </div>
              <div className="flex mx-4 mt-2 items-center justify-between gap-2">
                <div className="flex flex-col w-full">
                  <div className="text-xs mb-1 mt-2 mx-1">Task Type</div>
                  <div className="bg-slate-200 h-10 rounded-md flex items-center w-full text-sm">
                    <div
                      className={`h-8 ${
                        !isRecurral
                          ? "bg-primary shadow-lg text-white"
                          : "text-primary"
                      } w-[100%] flex items-center justify-center rounded-md ml-1 cursor-pointer rounded-r-none`}
                      onClick={() => setIsRecurral(false)}
                    >
                      Normal
                    </div>
                    <div
                      className={`h-8 w-[100%] ${
                        isRecurral
                          ? "bg-primary shadow-lg text-white"
                          : "text-primary"
                      } flex items-center justify-center rounded-md mr-1 cursor-pointer rounded-l-none`}
                      onClick={() => setIsRecurral(true)}
                    >
                      Recurral
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mx-4 mt-2 items-center justify-between gap-2">
                {isRecurral ? (
                  <div className="flex flex-col">
                    <div className="text-xs mx-1 mb-1 mt-2">
                      Reccural Interval
                    </div>
                    <div className="bg-slate-200 h-10 rounded-md flex items-center w-96 text-sm">
                      <div
                        className={`h-8 ${
                          recurralInterval === "daily"
                            ? "bg-primary shadow-lg text-white"
                            : "text-primary"
                        } w-[100%] flex items-center justify-center rounded-md ml-1 cursor-pointer rounded-r-none`}
                        onClick={() => setRecurralInterval("daily")}
                      >
                        Daily
                      </div>
                      <div
                        className={`h-8 w-[100%] ${
                          recurralInterval === "weekly"
                            ? "bg-primary shadow-lg text-white"
                            : "text-primary"
                        } flex items-center justify-center cursor-pointer`}
                        onClick={() => setRecurralInterval("weekly")}
                      >
                        Weekly
                      </div>
                      <div
                        className={`h-8 w-[100%] ${
                          recurralInterval === "monthly"
                            ? "bg-primary shadow-lg text-white"
                            : "text-primary"
                        } flex items-center justify-center cursor-pointer rounded-l-none`}
                        onClick={() => setRecurralInterval("monthly")}
                      >
                        Monthly
                      </div>
                      <div
                        className={`h-8 w-[100%] ${
                          recurralInterval === "annual"
                            ? "bg-primary shadow-lg text-white"
                            : "text-primary"
                        } flex items-center justify-center rounded-md mr-1 cursor-pointer rounded-l-none`}
                        onClick={() => setRecurralInterval("annual")}
                      >
                        Annual
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mx-4 mt-2 flex gap-2">
                <DateInput
                  label="Start Date"
                  hint="Select Start Date"
                  className=" text-2xl"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <DateInput
                  label="End Date *"
                  hint="Select End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-2xl"
                />
              </div>
              {isRecurral && recurralInterval === "daily" ? (
                <div className="mx-4 mt-2 flex gap-2">
                  {/* <TimeInput
                    label="Start Time"
                    hint="Select Start Time"
                    className=" text-2xl"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <TimeInput
                    label="End Time"
                    hint="Select End Time"
                    className="text-2xl"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  /> */}
                </div>
              ) : null}

              {/* :Attachment */}
              <div className="flex flex-col mx-4 mt-4">
                <div className="flex font-bold items-center gap-1">
                  <Attachment fontSize="small" /> Attachments
                </div>
                <LineBreak className="mt-1" />
              </div>
              <div className="flex flex-col mx-4">
                <div className="flex flex-wrap">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="h-14 w-36 mt-4 flex justify-between border border-slate-500 rounded-md mr-2 px-2 py-1 "
                    >
                      <div className="flex flex-col w-24 text-xs font-bold text-ellipsis line-clamp-2 whitespace-nowrap overflow-hidden">
                        {file.name}
                        <div className="text-xs font-normal">
                          {formatSizeInBytes(file.size)}
                        </div>
                      </div>
                      <div>
                        <Cancel
                          className="cursor-pointer"
                          fontSize="small"
                          onClick={() => {
                            setFiles((prev) =>
                              prev.filter(
                                (file) => file.name !== files[index].name
                              )
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <label
                    htmlFor="attatchment-add-button"
                    className="h-14 w-36 mt-4 rounded-md flex items-center justify-center cursor-pointer border border-slate-500 hover:bg-slate-200"
                  >
                    <input
                      id="attatchment-add-button"
                      hidden
                      type="file"
                      onChange={(e) => {
                        if (e.target && e.target.files?.length === 0) return;
                        const newFiles: File[] = [];
                        for (let i = 0; i < e.target.files!.length; i++) {
                          newFiles.push(e.target.files!.item(i)!);
                        }
                        console.log(newFiles);
                        setFiles((prev) => [...prev, ...newFiles]);
                      }}
                    />
                    <Add fontSize="small" className="flex-grow" />
                    <div className="text-xs font-semibold flex-grow">
                      Add Attachment
                    </div>
                  </label>
                </div>
              </div>
              <div className="mx-4 mt-4 mb-[200px]">
                <Editor />
              </div>
              <div className="mt-4 m-4">
                <Button
                  label="Submit"
                  className="bg-primary"
                  onClick={submitTask}
                />
              </div>
            </div>
          </div>
          <div className="w-[370px] border-l flex flex-col justify-between">
            <div className="flex flex-col mx-4 mt-8 flex-grow">
              <div className="flex font-bold items-center gap-1">
                <CommentIcon fontSize="small" /> Comments
              </div>
              <LineBreak className="mt-1" />
            </div>
            <div className="m-2 flex gap-2">
              <TextInput label="Message" hint="Type a Comment" />
              <div className="bg-primary hover:bg-slate-700 flex items-center cursor-pointer justify-center w-20 rounded-md">
                <Send sx={{ color: "white" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateTask;
