import axios from "axios"
import { values } from "mobx";
import { Tournament } from "./Interfaces/Tournament";
import { LoginForm, User } from "./Interfaces/User";

const instance = axios.create({baseURL: "http://localhost:5000/api"});

instance.interceptors.request.use(config=>
{
    const jwt = localStorage.getItem("jwt");
    if(jwt)
    {
        config.headers = {"Authorization": "Bearer "+jwt};
    }
    return config;
});


const Users = 
{
    login: (loginForm: LoginForm)=>instance.post<User>("/user/login", loginForm).then(value=>value.data),
    getCurrentUser: () => instance.get<User>("/user").then(value=>value.data)
}

const Tournaments = 
{
    get: ()=>{return instance.get<Tournament[]>("/tournaments").then((value)=>value.data)}
}

export const agent = 
{
    Tournaments,
    Users
}


