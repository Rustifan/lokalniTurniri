import { Photo } from "./Photo";

export interface UserProfile
{
    username: string;
    email: string;
    bio?: string;
    avatar?: string;
    images?: Photo[];

}