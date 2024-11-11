import { User } from "./User";

export interface AuthProps {
    record: User,
    token: string;
}