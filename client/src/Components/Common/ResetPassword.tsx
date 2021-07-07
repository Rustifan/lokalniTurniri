import React, { useState } from "react"
import { useEffect } from "react";
import { useParams } from "react-router"
import { agent } from "../../App/agent";
import NotFoundPage from "../Errors/NotFound";
import ResetPasswordForm from "../Forms/ResetPasswordForm";
import LoadingComponent from "../Loading/LoadingComponent";

interface Params
{
    username: string;
    token: string;
}

export default function ResetPassword()
{
    const [tokenValid, setTokenValid] = useState(false);
    const [validatingToken, setValidatingToken] = useState(false);
    const {username, token} = useParams<Params>();
    useEffect(()=>{
        setValidatingToken(true);
        agent.Users.verifyPasswordToken({username, token})
            .then(()=>
            {
                setTokenValid(true);
                setValidatingToken(false);
            })
            .catch(()=>
            {
                setValidatingToken(false);
            })
            // eslint-disable-next-line
    }, []);

    return (
        validatingToken ? 
        
        <LoadingComponent text="Učitavanje"/>
        :
        (tokenValid ?

        <ResetPasswordForm username={username} token={token}/>
        :
        <NotFoundPage 
            text="Token nije valjan ili je istekao"
            status={400}/>
        )
       
    )
}