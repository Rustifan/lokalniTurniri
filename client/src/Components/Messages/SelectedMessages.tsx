import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react"
import { Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";
import DisplayMessage from "./DisplayMessage";

interface Props
{
    selectedInterlocutor: string;
}

export default observer(function SelectedMessages({selectedInterlocutor}: Props)
{
    const { messageStore} = store;
    const {messages} = messageStore;
    const selectedMessages = messages.get(selectedInterlocutor);
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    useEffect(()=>
    {
        messageEndRef.current?.scrollIntoView(true);
    }, [selectedMessages, messageEndRef])

    if(!selectedMessages) return <Segment style={{height: "100%"}}/>

    return(
        <Segment style={{height: "65vh", overflow: "auto"}}>
            {selectedMessages.map((message)=>(

                <DisplayMessage key={message.id} message={message}/>
            ))}
            <div ref={messageEndRef}/>
        </Segment>
    )
});