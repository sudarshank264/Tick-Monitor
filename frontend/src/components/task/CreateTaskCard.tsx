"use client";

import TailwindAdvancedEditor from "@/components/editor/editor";
import AutofillInput from "@/components/ui/form/AutofillInput";
import DateInput from "@/components/ui/form/DateInput";
import TextInput from "@/components/ui/form/TextInput";
import { useAuth } from "@/contexts/AuthContext";
import { useDomain } from "@/contexts/DomainContext";
import { useTasks } from "@/contexts/TasksContext";
import { urgencies } from "@/lib/utils/consts";
import { getDateTime } from "@/lib/utils/datetimeUtils";
import { Cancel } from "@mui/icons-material";
import { Dialog, DialogActions, Slide } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { EditorInstance, JSONContent } from "novel";
import { forwardRef, useRef, useState } from "react";

const Transition = forwardRef(function Transition(props: any, ref) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

const CreateTaskCard = ({
  showCreateDialog,
  handleClose,
}: {
  showCreateDialog: boolean;
  handleClose: () => void;
}) => {
  const tasks = useTasks();
  const router = useRouter();
  const domain = useDomain();
  const auth = useAuth();
  const [urgency, setUrgency] = useState<string>("medium");
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2); // Months are 0-based in JavaScript
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  });
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<JSONContent>([]);
  const [selectedVerticals, setSelectedVerticals] = useState<string[]>([]);
  const handleUrgencyClick = (urg: string) => {
    setUrgency(urg);
  };
  const handleAddTask = async () => {
    await axios
      .post("/api/tasks/", {
        title: title,
        description: JSON.stringify(description),
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
        interval: "none",
        startDate: getDateTime(startDate),
        dueDate: getDateTime(dueDate),
        urgency: urgency,
      })
      .then(async (res) => {
        await tasks?.syncTasks();
        setTitle("");
        setDescription([]);
        handleClose();
      })
      .catch((err) => err);
  };
  const handleDescChange = (editor: EditorInstance) => {
    setDescription(editor.getJSON());
  };
  const divRef = useRef(null);
  return (
    <Dialog
      maxWidth="lg"
      open={showCreateDialog}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <div className="flex h-[70vh] relative">
        <div
          className="flex flex-col justify-between px-6 mt-4 w-[560px]"
          ref={divRef}
        >
          <div className="">
            <TextInput
              label=""
              hint="Enter a title"
              className="border-none font-bold"
              style={{ fontSize: 23 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex mx-2">
              <div className="flex w-16 items-center text-xs text-slate-600">
                To *
              </div>
              <AutofillInput
                label=""
                parentRef={divRef}
                maxItems={1}
                className="border-none"
                hint="Mention Assignee to this Task"
                renderSelected={(sel, removeItem, idx) => (
                  <div
                    key={idx}
                    className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                  >
                    <div className="flex items-center">
                      <div className="mx-1 flex items-center justify-center w-5 h-5 text-xs bg-slate-400 rounded-full">
                        {sel.name[0]}
                      </div>
                      <div className="mr-2">{sel.name}</div>
                    </div>
                    <Cancel
                      className="w-6 h-6 cursor-pointer mr-[0.125em]"
                      onClick={() => {
                        removeItem(sel.id);
                        setTo((prev) => prev.filter((f) => f !== sel.id));
                      }}
                    />
                  </div>
                )}
                renderAutofillItem={(item, highlighted, selectItem, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      console.log("SELECTED: ", index);
                      selectItem(index);
                    }}
                    className={`flex gap-2 p-2 text-xs hover:bg-slate-400 cursor-pointer ${
                      highlighted
                        ? "bg-slate-400 border-l-2 border-slate-800"
                        : "bg-white"
                    }`}
                  >
                    <div className="bg-slate-600 rounded-full text-white w-6 h-6 flex items-center justify-center">
                      {item.name[0]}
                    </div>
                    <div className={`text-xs font-bold`}>
                      {item.name}
                      <div className="text-[10px] font-normal">
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
                onChange={(curr, full) => {
                  console.log(full);
                  setTo(full.map((t) => t.id));
                }}
              />
            </div>
            <div className="flex mx-2 mt-2">
              <div className="flex w-16 items-center text-xs text-slate-600">
                Cc
              </div>
              <AutofillInput
                label=""
                parentRef={divRef}
                maxItems={10}
                className="border-none"
                hint="Mention Assignee to this Task"
                renderSelected={(sel, removeItem, idx) => (
                  <div
                    key={idx}
                    className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                  >
                    <div className="flex items-center">
                      <div className="mx-1 flex items-center justify-center w-5 h-5 text-xs bg-slate-400 rounded-full">
                        {sel.name[0]}
                      </div>
                      <div className="mr-2">{sel.name}</div>
                    </div>
                    <Cancel
                      className="w-6 h-6 cursor-pointer mr-[0.125em]"
                      onClick={() => {
                        removeItem(sel.id);
                        setCc((prev) => prev.filter((f) => f !== sel.id));
                      }}
                    />
                  </div>
                )}
                renderAutofillItem={(item, highlighted, selectItem, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      console.log("SELECTED: ", index);
                      selectItem(index);
                    }}
                    className={`flex gap-2 p-2 text-xs hover:bg-slate-400 cursor-pointer ${
                      highlighted
                        ? "bg-slate-400 border-l-2 border-slate-800"
                        : "bg-white"
                    }`}
                  >
                    <div className="bg-slate-600 rounded-full text-white w-6 h-6 flex items-center justify-center">
                      {item.name[0]}
                    </div>
                    <div className={`text-xs font-bold`}>
                      {item.name}
                      <div className="text-[10px] font-normal">
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
                searchMapper={(p: any) => p.name}
                onChange={(curr, full) => {
                  setCc(full.map((t) => t.id));
                  console.log(full.map((t) => t.id));
                }}
              />
            </div>

            <div className="flex items-center mx-2 mt-4">
              <div className="w-16 flex items-center text-xs text-slate-600">
                Date
              </div>
              <div className="flex gap-2">
                <DateInput
                  label="Start Date"
                  hint="Select Start Date"
                  className=" text-2xl border-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <DateInput
                  label="End Date *"
                  hint="Select End Date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-2xl border-none"
                />
              </div>
            </div>
            <div className="flex items-center mx-2 mt-2">
              <div className="w-16 flex items-center text-xs text-slate-600">
                Project
              </div>
              <AutofillInput
                parentRef={divRef}
                maxItems={1}
                className="border-none"
                label=""
                hint="Mention Businesses involved this Task"
                renderSelected={(sel, removeItem, idx) => (
                  <div
                    key={idx}
                    className="h-7 flex items-center justify-between text-xs ml-2 rounded-full bg-[#13495b] text-white min-w-[120px] text-ellipsis text-nowrap"
                  >
                    <div className="flex items-center">
                      <div className="mx-1 flex items-center justify-center w-5 h-5 text-xs bg-slate-400 rounded-full">
                        {sel.name[0]}
                      </div>
                      <div className="mr-2">{sel.name}</div>
                    </div>
                    <Cancel
                      className="w-6 h-6 cursor-pointer mr-[0.125em]"
                      onClick={() => removeItem(sel.id)}
                    />
                  </div>
                )}
                renderAutofillItem={(item, highlighted, selectItem, index) => (
                  <div
                    key={index}
                    onClick={() => selectItem(index)}
                    className={`flex gap-2 p-2 items-center hover:bg-slate-400 cursor-pointer ${
                      highlighted
                        ? "bg-slate-400 border-l-2 border-slate-800"
                        : "bg-white"
                    }`}
                  >
                    <div className="mx-1 flex items-center justify-center w-7 h-7 text-xs bg-slate-600 text-white rounded-full">
                      {item.name[0]}
                    </div>
                    <div className={`text-sm font-bold `}>
                      {item.name}
                      <div className="text-xs font-normal">{item.name}</div>
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
            <div className="flex mx-2 mt-2 items-center">
              <div className="flex w-16 items-center text-xs text-slate-600">
                Urgency
              </div>
              <div className="flex flex-wrap gap-2">
                {urgencies.map((urg, i) => (
                  <div
                    key={i}
                    className="text-xs font-light items-center gap-1 h-8 w-24 flex justify-center rounded-md cursor-pointer"
                    style={{
                      color: urg.color.color,
                      border: "1px solid",
                      borderColor:
                        urg.value === urgency
                          ? urg.color.color
                          : urg.color.backgroundColor,
                      backgroundColor:
                        urg.value === urgency
                          ? urg.color.backgroundColor
                          : undefined,
                    }}
                    onClick={() => handleUrgencyClick(urg.value)}
                  >
                    <div>{}</div>
                    <div className="scale-75">{urg.icon}</div>
                    {urg.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4 mb-4">
            <div
              style={{ width: "120px" }}
              onClick={handleClose}
              className="border border-slate-800 rounded hover:bg-slate-100 cursor-pointer h-9 flex items-center justify-center text-xs"
            >
              Cancel
            </div>
            <div
              style={{ width: "120px" }}
              onClick={handleAddTask}
              className="bg-slate-800 hover:bg-slate-700 rounded flex text-white cursor-pointer h-9 justify-center items-center text-xs"
            >
              Confirm
            </div>
          </div>
        </div>
        <div
          style={{ height: "calc(100% - 2rem)" }}
          className="flex flex-col items-center my-4 w-[560px] bg-slate-50 rounded mr-4 overflow-y-scroll p-4"
        >
          <TailwindAdvancedEditor
            storeKey="-draft"
            initialValue={description}
            onChange={handleDescChange}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CreateTaskCard;
