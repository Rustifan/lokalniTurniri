import { makeAutoObservable, reaction, runInAction } from "mobx";
import { history } from "..";
import { agent } from "../App/agent";
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
            runInAction(()=>
            {
                this.user = user;
            })
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
        this.loginModalOpen = open;
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
            await store.profileStore.updateProfile(this.user.username, newUser.username);
            runInAction(()=>
            {
                this.user = newUser;

            })
            localStorage.setItem("jwt", newUser.token);
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

}