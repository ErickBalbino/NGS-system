import { User } from "./User";

export interface AuthStore {
    model: User;
    token: string;
}