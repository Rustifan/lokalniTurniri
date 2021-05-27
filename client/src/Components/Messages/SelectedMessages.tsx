import { observer } from "mobx-react-lite";
import React from "react"
import { Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";
import DisplayMessage from "./DisplayMessage";

interface Props
{
    selectedInterlocutor: string;
}

export default observer(function SelectedMessages({selectedInterlocutor}: Props)
{
    const {userStore} = store;
    const {messages} = userStore;
    const selectedMessages = messages.get(selectedInterlocutor);
    if(!selectedMessages) return <Segment style={{height: "100%"}}/>

    return(
        <Segment style={{height: "100%", overflow: "auto"}}>
            {selectedMessages.map((message)=>(

                <DisplayMessage key={message.id} message={message}/>
            ))}
        </Segment>
    )
});