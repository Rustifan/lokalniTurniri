import * as signalR from "@microsoft/signalr";
import { get, makeAutoObservable, set } from "mobx";
import Message from "../App/Interfaces/Message";
import { store } from "./store";
import { history } from "..";

export class MessageStore
{
    messages = new Map<string, Message[]>();
    signalRConnection: signalR.HubConnection | null = null;
    selectedInterlocutor: null | string = null;

    constructor()
    {
        makeAutoObservable(this);
       
    }

    connect = ()=>
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
            this.signalRConnection.on("updateReadMessages", this.updateReadMessages);
            this.signalRConnection.on("messageDeleted", this.messageDeleted);
            this.signalRConnection.start();
        
        }
    }

    disconnect = ()=>
    {
        this.signalRConnection?.stop();
        this.signalRConnection = null;
    }

    markAsRead = (interlocutor: string)=>
    {
        this.signalRConnection?.invoke("MarkAsRead", interlocutor);
    }

    setSelectedInterlocutor = (interlocutor: string | null)=>
    {
        if(interlocutor)
        {
            this.markAsRead(interlocutor);
        }
        this.selectedInterlocutor = interlocutor;
    }
    
    getUnreadMessages = (interlocutor: string | null = null)=>
    {
        if(!store.userStore.user) return 0;
        let result = 0;
        if(interlocutor)
        {
            if(!this.messages.get(interlocutor)) return 0;
            for(let message of this.messages.get(interlocutor)!)
            {
                if(!message.read && message.receiver === store.userStore.user?.username) result++;
            }
            return result;
        }

        this.messages.forEach(values=>
        {
            for(let message of values)
            {
                if(!message.read && message.receiver === store.userStore.user?.username) result++
            }
        })

        return result;

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

    deleteMessage = (messageId: string) =>
    {
        this.signalRConnection?.invoke("DeleteMessage", messageId);
    }

    messageDeleted = (messageId: string, sender: string, reciever: string)=>
    {
        if(!store.userStore.user) return console.log("not loged in error");
        if(store.userStore.user.username === sender)
        {
            const messages = this.messages.get(reciever);
            if(!messages) return console.log("problem finding correct messages");
            this.messages.set(reciever, messages.filter(x=>x.id !== messageId));
        }
        else if(store.userStore.user.username === reciever)
        {
            const messages = this.messages.get(sender);
            if(!messages) return console.log("problem finding correct messages");
            this.messages.set(sender, messages.filter(x=>x.id !== messageId));
        }
    }

    receiveMessage = (message: Message) =>
    {
        const interlocutor = 
        message.sender === store.userStore.user?.username ? 
        message.receiver : message.sender;
        message.timeOfSending = new Date(message.timeOfSending);
        
        if(interlocutor === this.selectedInterlocutor)
        {
            this.markAsRead(interlocutor);
        }

        if(!get(this.messages, interlocutor)) set(this.messages, interlocutor, []);
        set(this.messages, interlocutor, [...get(this.messages, interlocutor), message]);
        
    }

    reloadMessages = ()=>
    {
        this.signalRConnection?.invoke("LoadMessages");
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

    updateReadMessages = (reader: string, sender: string) =>
    {
        if(!store.userStore.user) return console.log("Not loged in");
        if(store.userStore.user.username === reader)
        {
            const messages = this.messages.get(sender);
            if(messages)
            {
                for(const message of messages)
                {
                    if(message.sender === sender)
                    {
                        message.read = true;
                    }
                }
            }
        }
        else if(store.userStore.user.username === sender)
        {
            const messages = this.messages.get(reader)
            if(messages)
            {
                for(const message of messages)
                {
                    if(message.receiver === reader)
                    {
                        message.read = true;
                    }
                }
            }

            

        }
    }

    sendMessageError = (error: string)=>
    {
        
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


}