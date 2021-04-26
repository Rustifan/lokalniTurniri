import { makeAutoObservable } from "mobx";
import { Error } from "../App/Interfaces/Error";



export class ErrorStore
{
    error: Error | null = null;
    loginRegisterError: string | null = null;

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
        this.loginRegisterError = null;
    }


}