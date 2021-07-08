import { makeAutoObservable, reaction, runInAction } from "mobx";
import { toast } from "react-toastify";
import { history } from "..";
import { agent } from "../App/agent";
import { refreshTimerOffset } from "../App/Core/Constants";
import { ConfirmEmailDto } from "../App/Interfaces/ConfirmEmailDto";
import { ResetPasswordValues } from "../App/Interfaces/ResetPasswordValues";
import { ChangePasswordForm, LoginForm, RegisterDto, RegisterForm, User } from "../App/Interfaces/User";
import { UserProfile } from "../App/Interfaces/UserProfile";
import { store } from "./store";

export class UserStore
{
    user: User | null = null;
    loadingUser = false;
    resendingConfirmationMail = false;
    loginModalOpen = false;
    registerModalOpen = false;
    forgotPasswordModalOpen = false;
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
        this.stopRefreshTimer();
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
            await agent.Users.register(new RegisterDto(registerForm));
            this.setRegisterModalOpen(false);
            history.push("/registrationSuccess/"+registerForm.email);

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
            this.changeLogedInUser(user);
           
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
        store.errorStore.setNotConfirmedEmail(null);
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
    
    setForgotPasswordModalOpen = (open: boolean)=>
    {
        this.forgotPasswordModalOpen = open;
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
            this.changeLogedInUser(user);

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

    resetPassword = async (resetPasswordValues: ResetPasswordValues)=>
    {
        try
        {
            const user = await agent.Users.resetPassword(resetPasswordValues);
            this.changeLogedInUser(user);
            toast.success("Uspješno ste promijenili lozinku i sad ste ulogirani kao "+ user.username);
            history.push("/tournaments");

        }
        catch(err)
        {
            console.log(err);
        }
        

    }

    changeLogedInUser = (user: User)=>
    {
        localStorage.setItem("jwt", user.token);
        runInAction(()=>
        {
                this.user = user;
        })
        this.startRefreshTimer();
    }

    resendConfirmationMail = async (email: string)=>
    {
        this.resendingConfirmationMail = true;
        try
        {
            await agent.Users.resendConfirmationEmail(email);
            
            toast.success("Email je uspješno poslan");
        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            runInAction(()=>this.resendingConfirmationMail = false);
        }
    }

    confirmEmail = async (confirmEmailDto: ConfirmEmailDto)=>
    {
        this.loadingUser = true;
        try{
            const user = await agent.Users.confirmEmail(confirmEmailDto);
            this.changeLogedInUser(user);
            history.push("/tournaments");
            toast.success("Uspješno ste potvrdili mail, sad ste ulogirani kao "+user.username);
        }   
        catch(error)
        {
            console.log(error);
            
        }    
        finally
        {
            runInAction(()=>this.loadingUser=false);
        }
    }
}