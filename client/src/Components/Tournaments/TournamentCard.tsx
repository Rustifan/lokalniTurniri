import React from "react"
import { Button, Icon, Image, Item, Label, List, Message } from "semantic-ui-react";
import { Tournament } from "../../App/Interfaces/Tournament";
import UserAvatar from "../Users/UserAvatar";

interface Props
{
    tournament: Tournament;
}

const lorem = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."

export default function TournamentCard({tournament}: Props)
{
    let sportImg = "";
    switch(tournament.sport)
    {
        case "šah":
        sportImg = "chess.jpg";
        break;
        case "potezanje konopa":
        sportImg = "potezanjeKnopa.jpg";
        break;
        case "briškula" || "bela":
        sportImg = "cards.jpg"
        break;
        case "nogomet":
        sportImg = "soccer.jpg";
        break;
        default:
        sportImg = "ostalo.jpg";
        break;
    }
    const sportImgFullPath = "/Assets/Images/"+sportImg;

    return(
    
    <Item style={{marginTop: 30}}>
      <Item.Image style={{width: 200, height: 200, overflow: "hidden"}} src={sportImgFullPath} />

      <Item.Content>
        <Item.Header style={{fontSize: 25}} as='h2'>{tournament.name}</Item.Header>
        <Item.Meta>
        
        <Label basic color="green">{tournament.sport.toUpperCase()}</Label>
        </Item.Meta>
        
        <Item.Description>
            <Message info content={lorem.substr(0,200)}/>
        </Item.Description>
        <Item.Extra>
        <Label style={{marginRight: 10}} basic icon="user" color="blue" pointing="right" content="Administratori"/>
    
        <List horizontal>
            
                {tournament.admins.map((admin=>(
                  
                    <List.Item>
                    
                        <UserAvatar user={admin} highlited={tournament.hostUsername === admin}/>
                     </List.Item>)

                ))}
                
        </List>
         <Button floated="right" primary content="Prijavi se"/>
        </Item.Extra>
      </Item.Content>
    </Item>


    
    )
}