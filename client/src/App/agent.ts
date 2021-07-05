import axios, { AxiosError } from "axios"
import { toast } from "react-toastify";
import { history } from "..";
import { store } from "../Stores/store";
import { ApiResponseDelay } from "./Core/Constants";
import { TournamentFormValues, Tournament } from "./Interfaces/Tournament";
import { ChangePasswordForm, LoginForm, RegisterDto, User } from "./Interfaces/User";
import { UserProfile } from "./Interfaces/UserProfile";

const instance = axios.create({baseURL: "http://localhost:5000/api", withCredentials: true});

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

instance.interceptors.response.use(async (config)=>
{
    
    await sleep(ApiResponseDelay);
    
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
        else if(error.response.data.isUserError)
        {
            store.errorStore.setLoginRegisterError(error.response.data.message);
            
        }
        else
        {
           store.errorStore.setError({statusCode: 400, head: "Validation Error"});
        }
        throw(error);
        
        case 401:
        
        if(error.response.headers["www-authenticate"]?.startsWith('Bearer error="invalid_token"'))
        {
            store.userStore.logout();
            toast.error("Sesija je istekla. Nažalost morate se ponovno ulogirati")
        }
        else
        {
            
            store.errorStore.setError({statusCode: 401, head: "Zabranjen pristup"});
        }
        
        
        
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
        
    getCurrentUser: () => instance.get<User>("/user").then(value=>value.data),
    editUser: (editProfile: UserProfile)=>instance.put<User>("/userProfiles", editProfile)
        .then(value=>value.data),
    changePassword: (changePasswordForm: ChangePasswordForm)=> instance.put("/user/changePassword", changePasswordForm),
    refreshToken: ()=>instance.get<User>("/user/refreshToken").then(response=>response.data),
    googleLogin: (tokenId: string)=>instance.post<User>("/user/googleLogin", {tokenId}).then(response=>response.data),
    forgotPassword: (forgotPasswordObj: {email: string})=>instance.post("/user/forgotPassword", forgotPasswordObj),
    verifyPasswordToken: (passwordTokenObj: {username: string, token: string})=>instance.post("/user/verifyPasswordToken", passwordTokenObj)
}

const Tournaments = 
{
    get: (params: URLSearchParams)=>{return instance.get<Tournament[]>("/tournaments", {params}).then((value)=>value)},
    details: (id:string)=>instance.get<Tournament>("/tournaments/"+id).then(value=>value.data),
    create: (tournament: TournamentFormValues)=>instance.post("/tournaments", tournament),
    edit: (tournament: TournamentFormValues)=>instance.put("/tournaments/"+tournament.id, tournament),
    delete: (id: string)=>instance.delete("/tournaments/"+id),
    participate: (id: string)=>instance.put(`/tournaments/${id}/participate`),
    addContestor: (id: string, name: string, isGuest: boolean)=>
        instance.put(`/tournaments/${id}/addContestor?name=${name}&isGuest=${isGuest}`),
    closeApplications: (id: string)=>instance.put(`/tournaments/${id}/closeApplications`),
    addAdmin: (id: string, adminName: string)=>instance.put(`/tournaments/${id}/addAdmin?adminName=${adminName}`),
    removeAdmin: (id: string, adminName: string)=>instance.put(`/tournaments/${id}/removeAdmin?adminName=${adminName}`),
    calculatePairs: (id: string) => instance.put<Tournament>(`/tournaments/${id}/calculatePairs`).then(value=>value.data),
    setGameResult: (gameId: string, result: number)=>
        instance.put(`/tournaments/setGameResult/${gameId}?result=${result}`)

}

const UserProfiles = 
{
    details: (username: string) => instance.get<UserProfile>("/userProfiles/"+username).then(value=>value.data)
}

const Images = 
{
    post: (imageBlob: Blob)=> 
    {
        const formData = new FormData();
        formData.append("image", imageBlob);
        
        return instance.post("/pictures", formData,
            {headers: {"Content-Type": "multipart/form-data"}})
    },
    delete: (imageId: string)=>instance.delete("/pictures/"+imageId),
    setAvatar: (imageId: string)=>instance.put("/pictures/setAvatar/"+imageId)
}

export const agent = 
{
    Tournaments,
    Users,
    UserProfiles,
    Images,
    TestErrors
}


