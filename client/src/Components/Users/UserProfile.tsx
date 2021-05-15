import { observer } from "mobx-react-lite"
import React from "react"
import { useParams } from "react-router";
import { Container, Header } from "semantic-ui-react";

interface Params
{
    username: string;
}

export default observer(function UserProfile()
{

    const {username} = useParams<Params>();

    return (
        <Container style={{marginTop: 40}}>
            <Header textAlign="center" as="h1"></Header>

        </Container>
    )
});