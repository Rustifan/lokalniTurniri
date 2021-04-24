import axios, { AxiosError } from "axios"
import { Tournament } from "./Interfaces/Tournament";
import { LoginForm, RegisterDto, User } from "./Interfaces/User";

const instance = axios.create({baseURL: "http://localhost:5000/api"});

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

instance.interceptors.response.use(async (config)=>
{
    await sleep(2000);
    
    return config;
},(error: AxiosError)=>
{
    console.dir(error);
})

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
    register: (registerDto: RegisterDto)=>instance.post<User>("/user/register", registerDto).then(value=>value.data),
    login: (loginForm: LoginForm)=>instance.post<User>("/user/login", loginForm).then(value=>value.data),
    getCurrentUser: () => instance.get<User>("/user").then(value=>value.data)
}

const Tournaments = 
{
    get: ()=>{return instance.get<Tournament[]>("/tournaments").then((value)=>value.data)},
    details: (id:string)=>instance.get<Tournament>("/tournaments/"+id).then(value=>value.data)
}

export const agent = 
{
    Tournaments,
    Users
}


