import type { IUser } from "@/types/User";

export interface ISubject {
  _id: string;
  name: string;
  code: string;
  teacher?: IUser[];
  isActive: boolean;
}
