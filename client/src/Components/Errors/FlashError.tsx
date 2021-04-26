import React from "react"
import { Container, Header, Message } from "semantic-ui-react"
import { Error } from "../../App/Interfaces/Error"
import { store } from "../../Stores/store"

interface Props
{
    error: Error;
}

export default function FlashError({error}: Props)
{
    return(
        <Container style={{margin: 40}}>
            <Message onDismiss={()=>store.errorStore.removeError()} error >
                <Header textAlign="center" as="h5">Status code: {error.statusCode}</Header>
                <Header style={{padding:10}} textAlign="center" as="h3">Dogodila se greška :(</Header>
                <Header textAlign="center" as="h3">{error.head}</Header>
                {error.body &&
                <div className="serverError">{error.body}</div>}
            </Message>
        </Container>
    )
}