import { User } from "./user.type";

export interface TaskUser {
  id: string;
  user: User;
  role: "to" | "cc" | "assigne";
}
