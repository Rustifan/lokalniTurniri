import { observer } from "mobx-react-lite";
import React from "react"
import { useParams } from "react-router-dom"
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";

interface Params
{
    email: string;
}

export default observer(function RegistrationSuccess()
{
    const {email} = useParams<Params>();
    const {userStore: {resendConfirmationMail, resendingConfirmationMail}} = store;

    const handleResend = ()=>
    {
        resendConfirmationMail(email);
    }

    return(
        <Segment placeholder textAlign="center">
            <Header as="h1" icon color="green">
                <Icon name="check"/>
                Uspješno ste se registrirali
            </Header>
            <p>Molim vas da pogledate svoj email inbox (uključujući neželjenu poštu)</p>
            <p>Da bi ste se mogli uspješno ulogirati, portrebno je potvrditi email</p>
            
            <>
                <p>Ukoliko niste dobili mail, kliknite na gumb ispod za ponovno slanje emaila</p>
                <Button 
                    content="Ponovno pošalji" 
                    primary 
                    loading={resendingConfirmationMail}
                    disabled={resendingConfirmationMail}
                    onClick={handleResend} size="huge"/>
            </>
            

        </Segment>
    )
});