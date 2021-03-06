import { makeAutoObservable, runInAction } from "mobx";
import { history } from "..";
import { agent } from "../App/agent";
import { Tournament, TournamentContestingFilterEnum, TournamentLoadingParams } from "../App/Interfaces/Tournament";
import { UserProfile } from "../App/Interfaces/UserProfile";
import { store } from "./store";

export class ProfileStore
{
    profileMap: Map<string, UserProfile> = new Map();
    profileLoading = false;
    postingImageLoading = false;
    addPhotoMode = false;
    deletingPhotoId: null | string = null;
    settingAvatarId: null | string = null;
    selectedProfileTournamets: Tournament[] = [];
    profileTournamentsLoading = false;

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
                runInAction(()=>
                {
                    this.profileMap.set(username, profile!);

                })
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
        if(oldUsername === newUsername)
        {
            store.messageStore.reloadMessages();
        }
        return await this.getProfile(newUsername);
    }

    setAddPhotoMode = (mode: boolean)=>
    {
        this.addPhotoMode = mode;
    }

    postImage = async (image: Blob) =>
    {
        if(!store.userStore.user) return console.log("Not loged in");

        this.postingImageLoading = true;
        try
        {
            await agent.Images.post(image);
            await this.updateProfile(store.userStore.user.username, store.userStore.user.username);
            history.push("/userProfile/"+store.userStore.user.username);
            this.setAddPhotoMode(false);
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.postingImageLoading = false)
            
        }

    }

    deleteImage = async (photoId: string)=>
    {
        if(!store.userStore.user) return console.log("Not loged in");
        runInAction(()=>
        {
            this.deletingPhotoId = photoId;

        })
        try{
            await agent.Images.delete(photoId);
            await this.updateProfile(store.userStore.user.username, store.userStore.user.username);

        }
        catch(err)
        {
            console.log(err);
        }
        finally{
            runInAction(()=>
            {
                this.deletingPhotoId = null;
            })
        }
    }

    setAvatar = async (imageId: string)=>
    {
        this.settingAvatarId = imageId;
        if(!store.userStore.user) return console.log("Not loged in");

        try{
            await agent.Images.setAvatar(imageId);
            await this.updateProfile(store.userStore.user.username, store.userStore.user.username);
            
        }
        catch(err)
        {
            console.log(err);
        }
        finally{
            runInAction(()=>this.settingAvatarId = null);
        }
    }
    
    loadProfileTournaments = async (contestorFilter: TournamentContestingFilterEnum, profileName: string)=>
    {
        this.profileTournamentsLoading = true;
        try
        {
            const tournamentParams = new TournamentLoadingParams();
            tournamentParams.contestingFilter = contestorFilter;
            tournamentParams.toggleFilter = "map";
            tournamentParams.searchUsername = profileName;
            tournamentParams.date.setTime(0);
            const urlParams = tournamentParams.toUrlParams();
            const tournaments = (await agent.Tournaments.get(urlParams)).data;
            tournaments.forEach(tournament=>
            {
                store.tournamentStore.addToTournamentMap(tournament);
            })
            runInAction(()=>
            {
                this.selectedProfileTournamets = tournaments;
            })
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.profileTournamentsLoading = false)
        }
    }

    clearProfileTournaments = ()=>
    {
        this.selectedProfileTournamets = [];
    }
}