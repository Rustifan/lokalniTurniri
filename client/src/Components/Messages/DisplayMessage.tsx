import { observer } from "mobx-react-lite"
import React from "react"
import Message from "../../App/Interfaces/Message"
import { store } from "../../Stores/store"
import CSS from "csstype";
import formatDistance from "date-fns/formatDistance"
import hrLocale from "date-fns/locale/hr";


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
    const messageColor = "#2ab548";
    const messageStyle: CSS.Properties = 
    {
        wordBreak: "break-word",
        position: "relative",
        background: messageColor,
        color: "#FFFFFF",
        fontSize: "20px",
        minWidth: "150px",
        maxWidth: "400px",
        lineHeight: "25px",
        width: "auto",
        height: "auto",
        borderRadius: "10px",
        padding: "20px"
    }

    const arrowStyle: CSS.Properties=
    {   
        position: "absolute",
        display: "block",
        width: 0,
        zIndex: 1,
        borderStyle: "solid",
        borderColor: "transparent "+ messageColor,
        top: "38%",
        marginTop: "-15px"
    }
    
    const leftArrowStyle: CSS.Properties = 
    {
        ...arrowStyle,
        borderWidth: "15px 22px 15px 0",
        left: "-22px",
       
    }

    const rightArrowStyle: CSS.Properties=
    {
        ...arrowStyle,
        borderWidth: "15px 0 15px 22px",
        right: "-22px",
    }

    const timeStyle: CSS.Properties = 
    {
        fontSize: "10px",
        lineHeight: "10px",
        position: "absolute",
        bottom: "2px",
        right: "2px",
        padding: "5px",
    }

    const seenStyle: CSS.Properties =
    {
        fontSize: "10px",
        lineHeight: "10px",
        position: "absolute",
        top: "5px",
        right: "5px",
        padding: "5px",
        color: message.read ? "blue": "grey"
    }

    return(
        <div style={{padding: 20, display: "flex", flexDirection: messageSent ? "row" : "row-reverse"}}>
            <div style={messageStyle}>
                <div style={{marginBottom: "15px", marginRight: "20px"}}>
                    {message.messageText}
                </div>
                <div style={messageSent ? leftArrowStyle : rightArrowStyle}>
                </div>
               
               <div style={timeStyle}>
                   {formatDistance(message.timeOfSending, new Date(), {locale: hrLocale})}
                   {messageSent && message.read &&
                   <span style={{color: "#22A7F0", fontSize: "20px", fontWeight: "bold"}}>     &#10004;</span>
                    }
                </div>
            </div>
        
        </div>
    )
})