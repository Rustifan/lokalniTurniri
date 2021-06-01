import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { userIcon } from "../../App/Core/Constants";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import { Container, Grid, Header, Image,  Segment} from "semantic-ui-react"
import CSS from "csstype";
import Message from "../../App/Interfaces/Message";
import reduceText from "../../App/Tools/reduceText";
import { formatDistance } from "date-fns";
import hrLocale from "date-fns/locale/hr";

interface Props
{
    interlocutor: string;
    setSelectedInterlocutor: (interlocutor: string)=>void;
    selectedInterlocutor: string | null;
}

export default observer(function MessageInterlocutor({interlocutor, setSelectedInterlocutor, selectedInterlocutor}: Props)
{
    const { profileStore: { getProfile, profileMap }, userStore: {messages, getUnreadMessages} } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const [hover, setHover] = useState(false);
    
    const interlocutorMessages = messages.get(interlocutor);
    let lastMessage: Message | null = null;
    if(interlocutorMessages?.length)
    {
        lastMessage = interlocutorMessages[interlocutorMessages.length -1];
    }
    
    const unreadMessages = getUnreadMessages(interlocutor);
    

    useEffect(() => {
        

        getProfile(interlocutor).then(value => setProfile(value));
    }, [interlocutor, setProfile, getProfile, profileMap.size]);

    const style: CSS.Properties =
    {
        backgroundColor: selectedInterlocutor===interlocutor ? "rgb(240,230,240)" : hover ? "white" :  "Menu",
        cursor: hover ? "pointer" : "default"

    }


    return (
        <Segment 
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={()=>setSelectedInterlocutor(interlocutor)}
            style={style}
            >       
        <Container>
        <Grid>
        <Grid.Column width="5">
           <Image 
                circular 
                style={{width: "70px", marginLeft: "5px"}} 
                src={profile && profile.avatar ? profile.avatar : userIcon} 
                />
        </Grid.Column>
        <Grid.Column width="8">
            <Header style={{marginTop: 5, marginBottom: 5}}>{interlocutor}</Header>
            <div style={{wordBreak: "break-word"}}>{lastMessage && reduceText(lastMessage.messageText, 40)}</div>
        </Grid.Column>
        <Grid.Column width="3">
            {unreadMessages > 0 &&
                <div className="unreadMessages">{unreadMessages}</div>
            }
            <div style={{fontSize: "10px", position: "absolute", bottom:5, right:10}}>{lastMessage && formatDistance(lastMessage.timeOfSending, new Date(), {locale: hrLocale})}</div>
        </Grid.Column>
        </Grid>
       </Container>
       </Segment>

    )
})