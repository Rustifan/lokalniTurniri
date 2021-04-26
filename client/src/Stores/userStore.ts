import { makeAutoObservable, runInAction } from "mobx";
import { agent } from "../App/agent";
import { LoginForm, RegisterDto, RegisterForm, User } from "../App/Interfaces/User";
import { store } from "./store";

export class UserStore
{
    user: User | null = null;
    loadingUser = false;
    loginModalOpen = false;
    registerModalOpen = false;
    

    constructor()
    {
        makeAutoObservable(this);
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
    
}