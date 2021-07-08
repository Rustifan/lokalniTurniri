import { makeAutoObservable, runInAction } from "mobx";
import { Error } from "../App/Interfaces/Error";



export class ErrorStore
{
    error: Error | null = null;
    loginRegisterError: string | null = null;
    notConfirmedEmail: string | null = null; 


    constructor()
    {
        makeAutoObservable(this);
    }

    setError = (error: Error)=>
    {
        this.error = error;
    }

    removeError = () =>
    {
        this.error = null;
    }

    setLoginRegisterError = (error: string)=>
    {
        this.loginRegisterError= error;
    }

    removeLoginRegisterError = ()=>
    {
        runInAction(()=>
        {
            this.loginRegisterError = null;

        })
    }

    setNotConfirmedEmail = (email: string | null)=>
    {
        this.notConfirmedEmail = email;
    }

}