import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"

import { Container, Grid, Header, Segment } from "semantic-ui-react"
import { store } from "../../Stores/store"
import MessageInterlocutor from "./MessageInterlocutor"
import SelectedMessages from "./SelectedMessages"
import SendMessage from "./SendMessage"

export default observer(function Messages() {

    const { userStore, messageStore } = store;
    const { messageInterlocutors, selectedInterlocutor, setSelectedInterlocutor } = messageStore;
    useEffect(()=>
    {
        return ()=>{setSelectedInterlocutor(null)}
    }, [setSelectedInterlocutor])
    if (!userStore.user) return <></>;


    return (
        <Container style={{ marginTop: 40 }}>
            <Header style={{ padding: 20 }} as="h1" textAlign="center">Poruke</Header>
            <Grid divided>
                <Grid.Column style={{ overflow: 'auto', maxHeight: "70vh" }} width="5">
                    <Segment.Group>
                        {messageInterlocutors.map((interlocutor, index) => (


                            <MessageInterlocutor
                                key={index}
                                setSelectedInterlocutor={setSelectedInterlocutor}
                                selectedInterlocutor={selectedInterlocutor}
                                interlocutor={interlocutor}
                            />

                        ))}
                    </Segment.Group>
                </Grid.Column>
                <Grid.Column width="11">
                    {selectedInterlocutor &&
                        <Segment.Group>
                            <SelectedMessages selectedInterlocutor={selectedInterlocutor} />
                            <SendMessage sendTo={selectedInterlocutor} />
                        </Segment.Group>
                    }

                </Grid.Column>
            </Grid>
        </Container>
    )

});