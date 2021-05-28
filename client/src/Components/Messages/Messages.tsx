import { observer } from "mobx-react-lite"
import React, { useState } from "react"

import { Button, Container, Grid, Header, Item, Segment } from "semantic-ui-react"
import { store } from "../../Stores/store"
import MessageInterlocutor from "./MessageInterlocutor"
import SelectedMessages from "./SelectedMessages"
import SendMessage from "./SendMessage"

export default observer(function Messages() {

    const { userStore } = store;
    const { messageInterlocutors } = userStore;
    const [selectedInterLocutor, setSelectedInterlocutor] = useState<string | null>(null);
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
                                selectedInterlocutor={selectedInterLocutor}
                                interlocutor={interlocutor}
                            />

                        ))}
                    </Segment.Group>
                </Grid.Column>
                <Grid.Column width="11">
                    {selectedInterLocutor &&
                        <Segment.Group>
                            <SelectedMessages selectedInterlocutor={selectedInterLocutor} />
                            <SendMessage sendTo={selectedInterLocutor} />
                        </Segment.Group>
                    }

                </Grid.Column>
            </Grid>
        </Container>
    )

});