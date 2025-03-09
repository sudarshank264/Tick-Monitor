/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import TextInput from "../ui/form/TextInput";
import {
  ArrowForward,
  Attachment,
  Cancel,
  Download,
  History,
  InfoOutlined,
  MoreVert,
  Send,
  Comment as CommentIcon,
  Upload,
  Delete,
} from "@mui/icons-material";
import UserAvatar from "../user/UserAvatar";
import { formatSizeInBytes } from "@/lib/utils/fileSize";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { urgencies } from "@/lib/utils/consts";
import { Task } from "@/lib/types/task.type";
import { useTasks } from "@/contexts/TasksContext";
import { Tasklog } from "@/lib/types/task-log.type";
import { Comment } from "@/lib/types/comment-app.type";
import Comments from "./Comments";
import TailwindAdvancedEditor from "../editor/editor";

const TaskDrawer = ({
  t,
  open,
  onClose,
}: {
  t: Task;
  open: boolean;
  onClose: () => void;
}) => {
  const [task, setTask] = useState<Task>(t);
  const auth = useAuth();
  const tasks = useTasks();
  const [selectedTab, setSelectedTab] = useState(0);
  const [statusChangeTo, setStatusChangeTo] = useState<string>("");
  const [statusChangeConfirmation, setStatusChangeConfirmation] =
    useState(false);
  const [expandPeople, setExpandPeople] = useState(false);
  const [showMoreEl, setShowMoreEl] = useState<HTMLElement | null>(null);
  const [attatchments, setAttatchments] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [logs, setLogs] = useState<Tasklog[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [curComment, setCurrComment] = useState<string>("");
  const fetchDetails = async () => {
    await axios.get(`/api/tasks/${t.id}`).then((res) => {
      console.log("FETCHED_TASK: ", res.data.response);
      setTask(res.data.response);
      setComments(res.data.response.comments);
      setAttatchments(res.data.response.attatchments);
      setLogs(res.data.response.logs);
    });
  };
  const sendComment = async () => {
    const res = await axios
      .post("/api/comments", {
        taskId: t.id,
        userId: auth?.user.sub,
        content: curComment,
      })
      .then((res) => {
        fetchDetails();
        setCurrComment("");
      });
  };
  const addAttachment = async () => {
    if (!files.length) {
      console.log(t);
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("userId", auth?.user.sub);
    formData.append("taskId", t.id);
    const res = await axios.post(`/api/attachments`, formData);
    console.log(res.data);
    await tasks?.syncTasks();
    await fetchDetails();
    setFiles([]);
  };
  const deleteAttachment = async (id: string) => {
    await axios.delete(`/api/attachments/${id}`).then((res) => {
      console.log(res.data);
    });
    await tasks?.syncTasks();
    await fetchDetails();
  };
  const submitStatusChange = async () => {
    await axios
      .put(`/api/tasks/${t.id}`, {
        status: statusChangeTo.replace(" ", "_").toLowerCase(),
        userId: auth?.user.sub,
        remarks: "",
      })
      .then(async (res) => {
        console.log(res.data);
        if (res.data.success) {
          setStatusChangeConfirmation(false);
          await tasks?.syncTasks();
          await fetchDetails();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDesc = async (desc: string) => {
    await axios
      .put(`/api/tasks/${t.id}`, {
        description: desc,
      })
      .then(async (res) => {
        console.log(res.data);
        if (res.data.success) {
          await tasks?.syncTasks();
          await fetchDetails();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!open) return;
    fetchDetails();
  }, [open]);
  const deleteTask = async () => {
    await axios.delete(`/api/tasks/${t.id}`).then((res) => {
      console.log(res.data);
      tasks?.syncTasks();
    });
  };
  const handleClose = () => {
    onClose();
    setComments([]);
  };
  const handleExpandPeople = () => {
    setExpandPeople(!expandPeople);
  };
  const handleStatusChange = (status: string) => {
    setStatusChangeTo(status);
    setStatusChangeConfirmation(true);
  };
  const handleMorePress = (e: any) => {
    setShowMoreEl(e as HTMLElement);
  };
  const handleMoreClose = () => {
    setShowMoreEl(null);
  };
  const handleConfirmationialogClose = () => {
    setStatusChangeConfirmation(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      {/* :Dialog */}
      <Dialog
        open={statusChangeConfirmation}
        onClose={handleConfirmationialogClose}
      >
        <DialogTitle className="text-sm">
          Are you sure you want to continue?
        </DialogTitle>
        <DialogContent className="text-xs">
          Confirming this will change the Task status. Please review your work
          before submitting.
        </DialogContent>
        <DialogActions>
          <div
            style={{ width: "120px" }}
            onClick={handleConfirmationialogClose}
            className="border border-slate-800 rounded hover:bg-slate-100 cursor-pointer h-7 flex items-center justify-center text-xs"
          >
            Cancel
          </div>
          <div
            style={{ width: "120px" }}
            onClick={submitStatusChange}
            className="bg-slate-800 hover:bg-slate-700 rounded flex text-white cursor-pointer h-7 justify-center items-center text-xs"
          >
            Confirm
          </div>
        </DialogActions>
      </Dialog>

      <Menu
        open={Boolean(showMoreEl)}
        anchorEl={showMoreEl}
        onClose={handleMoreClose}
      >
        <MenuItem
          onClick={deleteTask}
          className="font-xs flex items-center gap-2"
        >
          <Delete color="error" fontSize="small" /> Delete
        </MenuItem>
      </Menu>
      <div className="h-screen flex flex-col w-[540px]">
        <div className="flex mt-4 items-center rounded-lg mx-2">
          <div className="flex justify-between w-full items-center">
            <div className="text-2xl flex flex-wrap gap-2 items-center font-bold px-2 py-2 text-wrap break-words">
              {task!.title}
              <div className="flex items-center scale-90">
                <div
                  className="text-xs font-light items-center gap-1 h-6 px-2 flex justify-center rounded-md"
                  style={{
                    ...urgencies.filter((u) => u.value === task!.urgency)[0]
                      .color,
                    borderColor: urgencies.filter(
                      (u) => u.value === task!.urgency
                    )[0].color.color,
                    borderWidth: "1px",
                  }}
                >
                  {urgencies.filter((u) => u.value === task!.urgency)[0].label}
                </div>
              </div>
            </div>
            <IconButton size="small" onClick={(e) => handleMorePress(e.target)}>
              <MoreVert fontSize="small" />
            </IconButton>
          </div>
        </div>

        <div className="flex items-center mx-4 gap-1">
          <div className="text-xs text-start w-[60px] text-slate-400">
            People
          </div>
          <div className="w-[120px] px-4 py-1 flex justify-between flex-grow">
            <div className="flex items-center">
              <UserAvatar
                tUser={{
                  id: task!.assignedBy.id,
                  role: "assigne",
                  user: task!.assignedBy,
                }}
                left={`0px`}
              />
              <ArrowForward
                fontSize="small"
                sx={{
                  color: "gray",
                  position: "relative",
                  left: "30px",
                }}
              />
              {task!.assignedUsers.map((u, index) => (
                <UserAvatar
                  key={index}
                  tUser={task!.assignedUsers[index]}
                  id={u.user.id}
                  left={`${index * 17 + 30}px`}
                />
              ))}
            </div>
            <div>
              <IconButton onClick={handleExpandPeople}>
                <InfoOutlined
                  fontSize="small"
                  className="scale-90 cursor-pointer"
                />
              </IconButton>
            </div>
          </div>
        </div>
        {expandPeople && <ExpandPeople t={task!} />}

        <div className="flex items-center mx-4 mt-2 gap-1">
          <div className="text-xs text-start w-[60px] mr-4 pr-2 text-slate-400">
            Timeline
          </div>
          <div className="text-xs bg-slate-200 h-7 flex items-center justify-center px-2 rounded">
            {new Date(task!.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
          <ArrowForward fontSize="small" sx={{ color: "gray" }} />
          <div className="text-xs bg-slate-200 h-7 flex items-center justify-center px-2 rounded">
            {new Date(task!.dueDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "short",
            })}
          </div>
        </div>
        <div className="flex items-center mt-4 mx-4 gap-2">
          <div className="text-xs text-start mr-3 w-[60px] text-slate-400">
            Business
          </div>
          <div className="w-[120px]">
            {task!.vertices.length !== 0 ? (
              <div className="h-7 flex items-center justify-between text-xs rounded-full border text-[#13495b] border-slate-400">
                <div className="flex items-center">
                  <div className="mx-1 flex items-center justify-center text-white bg-slate-600 rounded-full w-5 h-5 text-xs">
                    {task!.vertices[0].name[0]}
                  </div>
                  <div className="mr-2 text-ellipsis text-nowrap line-clamp-1">
                    {task!.vertices[0].name}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center mx-4 mt-4 gap-2">
          <div className="text-xs text-start w-[60px] mr-3 text-slate-400">
            Status
          </div>
          {["To Initiate", "In Progress", "Completed", "On Hold"].map(
            (s, i) => (
              <div
                key={i}
                className={`font-normal flex items-center justify-center hover:bg-slate-200 cursor-pointer h-7 w-24 text-[12px] rounded-md ${
                  task!.status === s.replace(" ", "_").toLowerCase()
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : ""
                } border border-slate-600`}
                onClick={() => handleStatusChange(s)}
              >
                {s}
              </div>
            )
          )}
        </div>
        {/* :Tab */}
        <div className="flex h-12 mx-4 font-bold justify-between items-center mt-4 text-sm">
          <div
            className={`flex-grow h-12 flex border-b cursor-pointer items-center border-slate-200`}
          >
            <div className="flex gap-2">
              {selectedTab === 0 && "Info"}
              {selectedTab === 1 && "Comment"}
              {selectedTab === 2 && "Attachment"}
              {selectedTab === 3 && "Log"}
            </div>
          </div>
          <div className="flex h-12 w-[50%] items-center text-center">
            <div
              className={`flex-grow flex h-12 justify-center border-b cursor-pointer items-center hover:bg-slate-200 ${
                selectedTab === 0
                  ? " border-slate-800 bg-slate-100 "
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedTab(0)}
            >
              <InfoOutlined fontSize={"small"} />
            </div>
            <div
              className={`flex-grow flex h-12 justify-center border-b cursor-pointer items-center hover:bg-slate-200 ${
                selectedTab === 1
                  ? " border-slate-800 bg-slate-100 "
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedTab(1)}
            >
              <CommentIcon fontSize={"small"} />
            </div>
            <div
              className={`flex-grow flex h-12 justify-center border-b cursor-pointer items-center hover:bg-slate-200 ${
                selectedTab === 2
                  ? "border-slate-800 bg-slate-100"
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedTab(2)}
            >
              <Attachment fontSize={"small"} />
            </div>
            <div
              className={`flex-grow flex h-12 justify-center border-b cursor-pointer items-center hover:bg-slate-200 ${
                selectedTab === 3
                  ? " border-slate-800  bg-slate-100"
                  : "border-slate-200"
              }`}
              onClick={() => setSelectedTab(3)}
            >
              <History fontSize={"small"} />
            </div>
          </div>
        </div>
        {selectedTab === 0 ? (
          <div className="flex flex-col mx-2">
            <div className="flex text-sm items-center my-2 mx-2">
              <div className="text-md font-normal overflow-y-auto w-full text-slate-600 px-4 py-1 text-wrap break-words">
                <TailwindAdvancedEditor
                  storeKey={`-${t.id}`}
                  initialValue={JSON.parse(task!.description)}
                  onChange={() => {}}
                  onSave={updateDesc}
                />
              </div>
            </div>
          </div>
        ) : null}
        {selectedTab === 1 ? (
          <Comments
            sendComment={sendComment}
            setCurrComment={setCurrComment}
            curComment={curComment}
            comments={comments}
          />
        ) : null}

        {selectedTab === 2 ? (
          <div className="flex flex-wrap gap-2 px-4 py-2 pb-[100px]">
            {task!.attatchments.map((a, i) => (
              <div
                key={i}
                className="flex items-center px-2 border rounded py-2 gap-2"
              >
                <div>
                  <Tooltip className="cursor-pointer" title={a.user.name}>
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-600 text-white rounded-full">
                      {a.user.name[0]}
                    </div>
                  </Tooltip>
                </div>
                <div className="flex flex-col max-w-[100px] flex-grow h-full">
                  <div className="text-sm text-slate-800 font-[500] text-ellipsis line-clamp-1">
                    {a.name}
                  </div>
                  <div className="text-xs text-slate-400 font-light">
                    {a.name.split(".")[1]}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    title="Delete"
                    onClick={() => deleteAttachment(a.id)}
                    size="medium"
                  >
                    <Cancel />
                  </IconButton>
                  <IconButton
                    title="Download"
                    href={a.url}
                    download
                    size="medium"
                  >
                    <Download />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        {/* :Logs */}
        {selectedTab === 3 ? (
          <div className="flex flex-col justify-start">
            {logs.map((l, i) => {
              return (
                <div
                  key={i}
                  className="text-xs h-12 bg-slate-100 rounded mt-2 mx-4 px-2 flex items-center justify-between"
                >
                  <div className="flex">
                    <div className="text-xs font-bold w-[90px] capitalize text-center">
                      {String(l.status).replace("_", " ")}
                    </div>
                    <div className="font-[500] text-slate-800 border-l border-slate-400 ml-2 pl-2">
                      {l.user.name}
                    </div>
                  </div>
                  <div className="text-slate-400 font-[400]">
                    {new Date(l.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {selectedTab === 2 ? (
        <div className="absolute flex flex-col bg-white border w-[540px] bottom-0">
          <div className="flex gap-2 px-2 overflow-x-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="h-16 w-36 my-2 flex justify-between border border-slate-500 rounded-md px-2 py-1 "
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
                        prev.filter((file) => file.name !== files[index].name)
                      );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* :FileInput */}
          <div className="flex items-center justify-between gap-2 px-2">
            <Tooltip title="Attach File">
              <label
                htmlFor="attatchment-add-button"
                className="h-12 w-14 flex items-center justify-center cursor-pointer hover:bg-slate-200"
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
                {/* <Add fontSize="small" className="flex-grow" />
          <div className="text-xs font-semibold flex-grow">
          Add Attachment
          </div> */}
                <Attachment />
              </label>
            </Tooltip>

            <div className="w-[60px] group">
              <IconButton onClick={() => addAttachment()}>
                <Upload fontSize="medium" className="" />
              </IconButton>
            </div>
          </div>
        </div>
      ) : null}
      {/* :CommentInput */}
      {selectedTab === 1 ? (
        <div className="absolute bg-white border w-[540px] bottom-0">
          <div className="px-2 flex items-center">
            <div className="" />
            <TextInput
              hint="Enter your comment"
              label="Comment"
              className="border-white mt-2 "
              value={curComment}
              onChange={(e) => setCurrComment(e.target.value)}
            />
            <div className="w-[60px] group">
              <IconButton onClick={() => sendComment()}>
                <Send fontSize="medium" className="" />
              </IconButton>
            </div>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
};

const ExpandPeople = ({ t }: { t: Task }) => (
  <div className="flex items-center mx-4 gap-1">
    <div className="w-[120px] flex justify-between flex-grow border border-slate-400 p-2 px-4 rounded ">
      <div className="flex flex-col">
        {t.assignedUsers.map((tUser, index) => (
          <div key={index} className="flex flex-row items-center my-1">
            <div className="flex flex-row items-center">
              <div
                style={{ textTransform: "capitalize" }}
                className="text-xs font-bold mr-2"
              >
                {tUser.role}
              </div>
              <div className="flex items-center">
                <UserAvatar tUser={tUser} />
                <div className="flex flex-col ml-[37px]">
                  <div className="text-sm font-[600]">{tUser.user.name}</div>
                  <div className="text-xs text-slate-400">
                    {tUser.user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TaskDrawer;
