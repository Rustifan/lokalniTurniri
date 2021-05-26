import { observer } from "mobx-react-lite"
import React, { useState } from "react"

import { Button, Container, Grid, Header, Item, Segment } from "semantic-ui-react"
import { store } from "../../Stores/store"
import MessageInterlocutor from "./MessageInterlocutor"

export default observer(function Messages(){
    
    const {userStore, profileStore} = store;
    const {messages, messageInterlocutors} = userStore;
    const [selectedInterLocutor, setSelectedInterlocutor] = useState<string | null>(null);
    
    console.log(messageInterlocutors);

    return (
        <Container style={{marginTop: 40}}>
            <Header style={{padding: 20}} as="h1" textAlign="center">Poruke</Header>
            <Grid divided>
                <Grid.Column style={{overflow: 'auto',  maxHeight: "70vh" }} width="5">
                    <Segment.Group>
                            {messageInterlocutors.map((interlocutor, index)=>(
                            
                                
                                <MessageInterlocutor key={index} interlocutor={interlocutor}/>
                                
                            ))}
                    </Segment.Group>
                </Grid.Column>
                <Grid.Column style={{overflow: 'auto',  maxHeight: "70vh" }} width="11">

                </Grid.Column>
            </Grid>
        </Container>
    )

})