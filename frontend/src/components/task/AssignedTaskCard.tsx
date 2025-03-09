import { IconButton } from "@mui/material";
import { LineBreak } from "../ui/LineBeak";
import { CommentOutlined } from "@mui/icons-material";
import UserAvatar from "../user/UserAvatar";
import { Task } from "@/lib/types/task.type";
import { useRouter } from "next/navigation";
import { timeLeftUntil } from "@/lib/utils/datetimeUtils";

const AssignedTaskCard = ({ t }: { t: Task }) => {
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer shadow-sm flex-col border border-slate-200 rounded-md w-[48%] px-4 pt-4 h-[270px] justify-between"
      onClick={() => {
        router.push(`/dashboard/task/${t.id}`);
      }}
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
        <div className="font-bold mt-2 flex flex-wrap items-center">
          {t.title}
          <div className="text-xs px-2 mx-1 my-[0.8px] font-light border-l border-slate-800">{t.urgency}</div>
        </div>
        <div className="text-slate-400 text-sm font-[300]">{t.description}</div>
        <LineBreak className="mt-2" />
        <div className="flex flex-row gap-2 mt-4">
          {t.assignedUsers.map((u, index) => (
            <UserAvatar key={index} id={u.user.id} />
          ))}
        </div>
      </div>
      <div>
        <LineBreak />
        <div className="flex items-center mt-1 justify-between gap-2">
          <div>
            {/* <UserAvatar id={t.assignedBy.id} key={t.assignedBy} /> */}
            <div className="text-xs font-[300] text-slate-400">
              {timeLeftUntil(t.dueDate)}
            </div>
          </div>
          <IconButton>
            <CommentOutlined className="text-slate-800" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default AssignedTaskCard;
