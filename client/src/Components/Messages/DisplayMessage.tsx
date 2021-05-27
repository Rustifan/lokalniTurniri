import { observer } from "mobx-react-lite"
import React from "react"
import { Message as SemanticMessage } from "semantic-ui-react"
import Message from "../../App/Interfaces/Message"
import { store } from "../../Stores/store"
import CSS from "csstype";

interface Props
{
    message: Message;
}

export default observer(function DisplayMessage({message}: Props)
{
    const {userStore} = store;
    const {user} = userStore;
    if(!user) return <></>;
    const messageSent = message.sender === user.username;
    const style: CSS.Properties = 
    {
        maxWidth: "500px",
        width: "fit-content",
       
    }

    return(
        <div style={{padding: 20, display: "flex", flexDirection: messageSent ? "row" : "row-reverse"}}>
        <SemanticMessage
            size="huge"
            
            color={messageSent ? "green": "blue"}

            style={style} 
            floating

            >
            
                {message.messageText}
            
        </SemanticMessage>
        </div>
    )
})