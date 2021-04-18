import { makeAutoObservable, runInAction } from "mobx";
import { agent } from "../App/agent";
import { LoginForm, User } from "../App/Interfaces/User";

export class UserStore
{
    private user: User | null = null;
    loadingUser = false;
    

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
    }

    getUser = async ()=>
    {
        if(this.user) return this.user;

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
    
}