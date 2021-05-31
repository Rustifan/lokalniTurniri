import { makeAutoObservable, reaction, runInAction, get, set } from "mobx";
import { history } from "..";
import { agent } from "../App/agent";
import { ChangePasswordForm, LoginForm, RegisterDto, RegisterForm, User } from "../App/Interfaces/User";
import { UserProfile } from "../App/Interfaces/UserProfile";
import { store } from "./store";
import * as signalR from "@microsoft/signalr";
import Message from "../App/Interfaces/Message";

export class UserStore
{
    user: User | null = null;
    messages = new Map<string, Message[]>();
    loadingUser = false;
    loginModalOpen = false;
    registerModalOpen = false;
    changePasswordModalOpen = false;    
    signalRConnection: signalR.HubConnection | null = null;
    selectedInterlocutor: null | string = null;

    constructor()
    {
        makeAutoObservable(this);
        
        reaction(()=>this.user, (user)=>
        {
            if(user)
            {
                const token = localStorage.getItem("jwt");
                if(token)
                {
                    this.signalRConnection = new signalR.HubConnectionBuilder()
                        .withUrl("http://localhost:5000/api/messageHub", {accessTokenFactory: ()=>token})
                        .build();
                    this.signalRConnection.on("loadMessages", this.loadMessages);
                    this.signalRConnection.on("receiveMessage", this.receiveMessage);
                    this.signalRConnection.on("sendMessageError", this.sendMessageError);
                    this.signalRConnection.start();
                }
            }
            else
            {
                this.signalRConnection?.stop();
                this.signalRConnection = null;
            }
        })
    }

    setSelectedInterlocutor = (interlocutor: string | null)=>
    {
        this.selectedInterlocutor = interlocutor;
    }
    
    sendMessage = (receiver: string, message: string) =>
    {
        
        this.signalRConnection?.invoke("SendMessage", receiver, message);
    }

    newMessage = (messageTo: string)=>
    {
        if(!this.messages.get(messageTo))
        {
            this.messages.set(messageTo, []);
        }
        this.setSelectedInterlocutor(messageTo);
        history.push("/messages");
    }

    receiveMessage = (message: Message) =>
    {
        const interlocutor = 
        message.sender === this.user?.username ? 
        message.receiver : message.sender;
        message.timeOfSending = new Date(message.timeOfSending);

        if(!get(this.messages, interlocutor)) set(this.messages, interlocutor, []);
        set(this.messages, interlocutor, [...get(this.messages, interlocutor), message]);
        
    }

    loadMessages = (messages: any)=>
    {
        
        const map = new Map<string, Message[]>(Object.entries(messages));
        map.forEach(messageArr=>{
            for(var message of messageArr)
            {
                message.timeOfSending = new Date(message.timeOfSending);
            }
        })
        this.messages = map;
    }

    sendMessageError = (error: string)=>
    {
        //TODO
        console.log(error);
    }
    get messageInterlocutors()
    {
        const messages = this.messages;
        const keyArray = messages.keys();
        

        return Array.from(keyArray)
            .sort((a, b)=>
            {
                const messageListA = get(messages, a);
                const messageListB = get(messages,b);
                if(!messageListA || messageListA.length===0) return -1;
                if(!messageListB || messageListB.length===0) return 1;
                
                const dateA = messageListA[messageListA.length-1].timeOfSending;
                const dateB = messageListB[messageListB.length-1].timeOfSending;

                return dateB.getTime() - dateA.getTime();
                
            });
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