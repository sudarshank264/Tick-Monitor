/* eslint-disable react-hooks/exhaustive-deps */
import { urgencies } from "@/lib/utils/consts";
import { Checkbox, Dialog, DialogActions, Slide } from "@mui/material";
import { Task } from "@/lib/types/task.type";
import { useState, forwardRef } from "react";
import axios from "axios";
import TextInput from "../ui/form/TextInput";
import DateInput from "../ui/form/DateInput";
import { TaskUser } from "@/lib/types/task-user.type";
import TailwindAdvancedEditor from "@/components/editor/editor"; // Adjust the import path as needed
import { JSONContent } from "novel";

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateSubTaskCard = ({
  t,
  onAdd,
  showDialog,
  handleClose,
}: {
  t: Task;
  onAdd: () => void;
  showDialog: boolean;
  handleClose: () => void;
}) => {
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date(t.startDate);
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  });

  const [dueDate, setDueDate] = useState<string>(() => {
    const today = new Date(t.dueDate);
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2);
    const day = `0${today.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  });

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState<JSONContent>([]);
  const [urgency, setUrgency] = useState<string>("medium");
  const [people, setPeople] = useState<TaskUser[]>([]);

  const handleUrgencyClick = (urg: string) => {
    setUrgency(urg);
  };

  const handleClick = (id: string) => {
    setPeople((prev) =>
      prev.map((p) => p.id).includes(id)
        ? prev.filter((p) => p.id !== id)
        : [...prev, t.assignedUsers.find((t) => t.id === id)!]
    );
  };

  const addSubTask = async () => {
    await axios
      .post("/api/tasks", {
        title,
        description: JSON.stringify(desc),
        startDate,
        dueDate,
        urgency,
        vertices: t.vertices.map((v) => v.id),
        assignedUsers: people.map((p) => ({ id: p.user.id, role: "cc" })),
        parentTaskId: t.id,
        assignedBy: t.assignedBy.id,
      })
      .then((res) => {
        console.log(res.data);
        onAdd();
        handleClose(); // Close the dialog after adding
      });
  };

  return (
    <Dialog
      open={showDialog}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth
    >
      <div className="w-full p-6 flex">
        {/* Left Side - Task Inputs */}
        <div className="flex flex-col justify-between w-[560px]">
          <div className="flex-1 pr-4">
            <TextInput
              label=""
              hint="Enter a title"
              className="border-none font-bold mb-4"
              style={{ fontSize: 23 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-4 mb-4">
              <DateInput
                label="Start Date"
                hint="Select Start Date"
                className="border-white border-b-disabled rounded-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <DateInput
                label="Due Date"
                hint="Select Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-white border-b-disabled rounded-none"
              />
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-grow">
                <h3 className="text-xs text-slate-600 mb-2">Assign Users</h3>
                <div className="flex flex-wrap gap-2">
                  {t.assignedUsers.map((tUser, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-200 rounded cursor-pointer h-12 px-2"
                      onClick={() => handleClick(tUser.id)}
                    >
                      <Checkbox
                        size="small"
                        checked={people.map((p) => p.id).includes(tUser.id)}
                        color="success"
                      />
                      <div className="flex flex-col">
                        <div className="text-primary font-[500] text-sm">
                          {tUser.user.name}
                        </div>
                        <div className="text-gray-600 font-light text-xs">
                          {tUser.user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex-grow">
                <h3 className="text-xs text-slate-600 mb-2">Urgency</h3>
                <div className="flex gap-2">
                  {urgencies.map((urg, i) => (
                    <div
                      key={i}
                      className="text-xs font-light items-center gap-1 h-12 w-24 flex justify-center rounded-md cursor-pointer"
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
                      <div className="scale-75">{urg.icon}</div>
                      {urg.label}
                    </div>
                  ))}
                </div>
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
              onClick={addSubTask}
              className="bg-slate-800 hover:bg-slate-700 rounded flex text-white cursor-pointer h-9 justify-center items-center text-xs"
            >
              Confirm
            </div>
          </div>
        </div>

        {/* Right Side - Editor */}
        <div className="flex-1">
          <div className="mb-4">
            <TailwindAdvancedEditor
              onChange={(editor) => setDesc(editor.getJSON())}
              initialValue={desc}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateSubTaskCard;
