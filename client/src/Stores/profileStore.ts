import { makeAutoObservable, runInAction } from "mobx";
import { agent } from "../App/agent";
import { UserProfile } from "../App/Interfaces/UserProfile";

export class ProfileStore
{
    profileMap: Map<string, UserProfile> = new Map();
    profileLoading = false;

    constructor()
    {
        makeAutoObservable(this);
    }

    getProfile = async (username: string)=>
    {
        this.profileLoading = true;
        let profile = this.profileMap.get(username);
        if(!profile)
        {
            try{
                profile = await  agent.UserProfiles.details(username);
                this.profileMap.set(username, profile);
            }
            catch(err)
            {
                console.log(err)
            }
            finally{
                runInAction(()=>this.profileLoading = false)
            }

        }
        return profile;
    }

    updateProfile = async (oldUsername: string, newUsername: string)=>
    {
        this.profileMap.delete(oldUsername);
        return await this.getProfile(newUsername);
    }
}