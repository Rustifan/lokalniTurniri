import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Message } from "semantic-ui-react";
import { store } from "../../Stores/store";

interface Props
{
    email: string;
}

export default observer(function NotConfirmedEmailError({email}: Props)
{
    const {userStore: {resendConfirmationMail, resendingConfirmationMail}} = store;

    const handleResendMail = ()=>
    {
        resendConfirmationMail(email);
    }

    return(
       <Message>
           <Message.Content>
                <p>Provjerite vaš email sandučić gdje smo vam poslali upute za potvrdu vašeg maila.</p>
                <p>Molimo vas da tokođer provjerite neželjenu poštu</p>
           </Message.Content>
           <Message.Content>
               Ukoliko niste dobili mail kliknite na gum ispod za ponovno slanje maila.
           </Message.Content>
           <Message.Content style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                <Button
                    style={{marginTop: 10}}
                    size="big"
                    color="blue"
                    content="Ponovno pošalji"
                    onClick={handleResendMail}
                    loading={resendingConfirmationMail}
                    disabled={resendingConfirmationMail}
                    />
           </Message.Content>
       </Message>
    )
});