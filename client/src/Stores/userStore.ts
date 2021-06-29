import { makeAutoObservable, reaction, runInAction } from "mobx";
import { history } from "..";
import { agent } from "../App/agent";
import { refreshTimerOffset } from "../App/Core/Constants";
import { ChangePasswordForm, LoginForm, RegisterDto, RegisterForm, User } from "../App/Interfaces/User";
import { UserProfile } from "../App/Interfaces/UserProfile";
import { store } from "./store";

export class UserStore
{
    user: User | null = null;
    loadingUser = false;
    loginModalOpen = false;
    registerModalOpen = false;
    changePasswordModalOpen = false;    
    refreshTimer: NodeJS.Timer | null = null;

    constructor()
    {
        makeAutoObservable(this);
        reaction(()=>this.user, (user)=>
        {
            
            if(user)
            {
                store.messageStore.connect();
            }
            else{
                store.messageStore.disconnect();

            }
           
        })
        
    }

    refreshToken = async ()=>
    {
        this.stopRefreshTimer();
        const user = await agent.Users.refreshToken();
        runInAction(()=>
        {
            this.user = user;
        })

        localStorage.setItem("jwt", user.token);
        
        this.startRefreshTimer();
    }

    startRefreshTimer = () =>
    {
        if(!this.user) return console.log("user not logged in");
        
        const jwt = this.user.token;
        const jwtObject = JSON.parse(atob(jwt.split(".")[1]));
        const expire =new Date(Number.parseInt(jwtObject.exp) * 1000);
        const now = new Date();
        const expireIn = expire.getTime() - now.getTime();
        
        this.refreshTimer = setTimeout(this.refreshToken,  expireIn - refreshTimerOffset);
    }

    stopRefreshTimer = ()=>
    {
        if(this.refreshTimer)
        clearTimeout(this.refreshTimer);
    }

    register = async (registerForm: RegisterForm)=>
    {
        this.loadingUser = true;
        try
        {
            const user = await agent.Users.register(new RegisterDto(registerForm));
            localStorage.setItem("jwt", user.token);
            runInAction(()=>
            {
                this.user= user;
                this.registerModalOpen = false;
            });
            this.startRefreshTimer();
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.loadingUser = false;
            })
        }
    }

    login = async (loginForm: LoginForm) =>
    {
        this.loadingUser = true;
        try
        {
            const user = await agent.Users.login(loginForm);
            localStorage.setItem("jwt", user.token);
            runInAction(()=>
            {
                this.user = user;
            });

            this.setLoginModalOpen(false);
            this.startRefreshTimer();
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.loadingUser = false;
            })
        }
    }

    logout = ()=>
    {
        this.stopRefreshTimer();
        localStorage.removeItem("jwt");
        this.user= null;
        
    }

    getUser = async ()=>
    {
        if(this.user) return this.user;
        
        if(!localStorage.getItem("jwt")) return null;
        
        this.loadingUser = true;
        
        try
        {
            const user = await agent.Users.getCurrentUser();
            console.log(user);
            runInAction(()=>
            {
                if(user)
                {
                    this.user = user;

                }
            })
            this.startRefreshTimer();
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.loadingUser = false;
            });
            return this.user;
        }
    }

    setLoginModalOpen = (open: boolean)=>
    {
        store.errorStore.removeLoginRegisterError();
        runInAction(()=>
        {
            this.loginModalOpen = open;

        })
    }

    setRegisterModalOpen = (open: boolean)=>
    {
        store.errorStore.removeLoginRegisterError();
        this.registerModalOpen = open;

    }
    
    editUser = async (editProfile: UserProfile)=>
    {
        if(!this.user) return console.log("There is no user loged in");
        try{

            const newUser = await agent.Users.editUser(editProfile);
            localStorage.setItem("jwt", newUser.token);
            await store.profileStore.updateProfile(this.user.username, newUser.username);
            runInAction(()=>
            {
                this.user = newUser;

            })
            history.push("/userProfile/"+newUser.username);           
        }
        catch(err)
        {
            console.log(err);
        }
    }

    isLogedIn=(username: string |null = null)=>
    {
        if(!username && this.user) return true;
        if(!this.user) return false;

        return this.user.username === username;
    }

    setChangePasswordModalOpen = (open: boolean) =>
    {
        this.changePasswordModalOpen = open;
    }

    changePassword = async (changePasswordForm: ChangePasswordForm)=>
    {
        if(!this.isLogedIn()) return console.log("Not loged in");

        try{
            await agent.Users.changePassword(changePasswordForm);
            this.setChangePasswordModalOpen(false);
        }
        catch(err)
        {
            console.log(err);
        }
    }

    googleLogin = async (googleLoginRes: any)=>
    {
        this.loadingUser = true;

        const {tokenId} = googleLoginRes;
        console.log(tokenId);
        if(!tokenId) return console.log("something went wrong");
        try{
            
            const user = await agent.Users.googleLogin(tokenId);
            localStorage.setItem("jwt", user.token);
            runInAction(()=>
            {
                this.user = user;
            });

        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(()=>this.loadingUser = false);
        }

    }

    googleLoginError = (error: any)=>
    {
        console.log(error);
    }

}