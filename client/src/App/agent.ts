import axios, { AxiosError } from "axios"
import { history } from "..";
import { store } from "../Stores/store";
import { TournamentFormValues, Tournament } from "./Interfaces/Tournament";
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
    switch(error.response?.status)
    {
        case 404:
        history.push("/notFound");
        throw(error);
        
        case 400:
        if(typeof error.response.data === "string")
        {
            store.errorStore.setError({statusCode: 400, head: error.response.data});

        }
        else if(error.response.data.userError)
        {
            store.errorStore.setLoginRegisterError(error.response.data.message);
            
        }
        else
        {
           store.errorStore.setError({statusCode: 400, head: "Validation Error"});
        }
        throw(error);
        
        case 401:
        store.errorStore.setError({statusCode: 401, head: "Zabranjen pristup"});
        throw(error);
    
        case 500:
        store.errorStore.setError({statusCode: 500, head: "Server Error",
            body: error.response.data.error + "\n" + error.response.data.errorDetails || ""});
        throw(error);
        case 403:
            store.errorStore.setError({statusCode: 403, head: "Zabranjeno ti je to raditi"});
        throw(error)
        
    }
})

instance.interceptors.request.use(config=>
{
    const jwt = localStorage.getItem("jwt");
    if(jwt)
    {
        config.headers = {"Authorization": "Bearer "+ jwt};
    }
    return config;
});

const TestErrors = 
{
    notFound: ()=>instance.get("/buggy/notFound"),
    badRequest: ()=>instance.get("/buggy/badRequest"),
    unauthorized: ()=>instance.get("/buggy/unauthorized"),
    serverError: ()=>instance.get("/buggy/serverError")
    
}

const Users = 
{
    register: (registerDto: RegisterDto)=>instance.post<User>("/user/register", registerDto)
        .then(value=>value.data),
    login: (loginForm: LoginForm)=>instance.post<User>("/user/login", loginForm)
        .then(value=>value.data),
        
    getCurrentUser: () => instance.get<User>("/user").then(value=>value.data)
}

const Tournaments = 
{
    get: ()=>{return instance.get<Tournament[]>("/tournaments").then((value)=>value.data)},
    details: (id:string)=>instance.get<Tournament>("/tournaments/"+id).then(value=>value.data),
    create: (tournament: TournamentFormValues)=>instance.post("/tournaments", tournament),
    edit: (tournament: TournamentFormValues)=>instance.put("/tournaments/"+tournament.id, tournament),
    delete: (id: string)=>instance.delete("/tournaments/"+id)
}

export const agent = 
{
    Tournaments,
    Users,
    TestErrors
}


