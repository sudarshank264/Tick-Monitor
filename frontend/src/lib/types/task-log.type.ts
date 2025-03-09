import { User } from "./user.type";

export interface Tasklog {
  status: string;
  user: User;
  remarks: string;
  createdAt: string;
}
