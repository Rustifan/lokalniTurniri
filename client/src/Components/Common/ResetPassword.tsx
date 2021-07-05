import React, { useState } from "react"
import { useEffect } from "react";
import { useParams } from "react-router"
import { agent } from "../../App/agent";
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

    }, []);

    return (
        validatingToken ? 
        
        <LoadingComponent text="Učitavanje"/>
        :
        (tokenValid ?

        <div>Valja</div>
        :
        <div>Nevalja</div>
        )
       
    )
}