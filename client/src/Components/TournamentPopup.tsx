import React from "react"
import { Link } from "react-router-dom"
import {  Image, Card, Icon, Label } from "semantic-ui-react"
import { Tournament } from "../App/Interfaces/Tournament"
import PictureFromSport from "../App/Tools/pictureFromSoprt"

interface Props
{
    tournament: Tournament;
}

export default function TournamentPopup({tournament}: Props)
{
    
    return (
        <Card as={Link}  to={"/tournaments/"+tournament.id}>
        <Image style={{position: "absolute", filter: "brightness(50%)"}} src={PictureFromSport(tournament.sport)} wrapped ui={false} />
        <Card.Header as="h2" style={{fontSize: 20, color: "white", zIndex: 10, height: 100, transform: "translate(0, 70px)"}} textAlign="center">{tournament.name}</Card.Header>
        <Card.Content style={{zIndex: 10, marginTop: 40}}>
        
            
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                <Label style={{marginBottom: "7px", display: "flex", justifyContent: "center", alignItems: "center"}} size="large" basic color="green">
                    <Icon name="winner" />
                    <div>{tournament.sport.toUpperCase()}</div>
                    
                </Label>
                <Label style={{display: "flex", justifyContent: "center", alignItems: "center"}} size="large" color="blue" basic>
                    <Icon name="location arrow" />  {tournament.location.formattedLocation}</Label>

            </div>


          
           
     
    </Card.Content>
        </Card>
    )
}