import { makeAutoObservable, runInAction } from "mobx";
import { agent } from "../App/agent";
import { LoginForm, User } from "../App/Interfaces/User";

export class UserStore
{
    user: User | null = null;
    loadingUser = false;
    loginModalOpen = false;
    

    constructor()
    {
        makeAutoObservable(this);
    }

    login = async (loginForm: LoginForm) =>
    {
        this.loadingUser = true;
        try
        {
            const user = await agent.Users.login(loginForm);
            localStorage.setItem("jwt", user.token);
            this.user = user;
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
        this.loginModalOpen = open;
    }
    
}