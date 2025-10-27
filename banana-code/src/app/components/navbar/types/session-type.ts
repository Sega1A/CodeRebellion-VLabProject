import { UserInfo } from "./userInfo-type";

export interface SessionType {
  expires: string;
  user: UserInfo;
}
