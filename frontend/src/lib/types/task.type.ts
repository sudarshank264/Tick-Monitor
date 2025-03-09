import { Attachment } from "./attachment.type";
import { Tasklog } from "./task-log.type";
import { TaskUser } from "./task-user.type";
import { User } from "./user.type";
import { Vertical } from "./vertical.type";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: User;
  assignedUsers: TaskUser[];
  startDate: string;
  dueDate: string;
  status: string;
  urgency: string;
  vertices: Vertical[];
  attatchments: Attachment[];
  subTasks: Task[];
  logs: Tasklog[];
}
