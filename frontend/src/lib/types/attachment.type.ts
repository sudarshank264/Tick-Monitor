import { User } from "./user.type";

export interface Attachment {
  name: string;
  url: string;
  user: User;
  id: string;
}
