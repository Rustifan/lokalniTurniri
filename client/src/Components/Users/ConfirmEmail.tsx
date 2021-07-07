import { observer } from "mobx-react-lite";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Button, Header, Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";

interface Params
{
    email: string;
    token: string;
}

export default observer(function ConfirmEmail()
{   
    const {email, token} = useParams<Params>();
    const {userStore: {loadingUser, confirmEmail, resendConfirmationMail, resendingConfirmationMail}} = store;

    useEffect(()=>
    {
        confirmEmail({email, token});
        // eslint-disable-next-line
    }, [])
    
    const handleResend = ()=>
    {
        resendConfirmationMail(email);
    }

    if(loadingUser) return <LoadingComponent text="Potvrđivanje emaila"/>

    return(
        <Segment>
        
        <Header as="h1" textAlign="center" style={{padding: 20}}>Potvrda emaila</Header>
        
        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

        <Button
            
            size="huge"
            color="blue"
            content="Ponovno pošalji mail"
            onClick={handleResend}
            loading={resendingConfirmationMail}
            disabled={resendingConfirmationMail}
            />
        </div>
        </Segment>
    )
});