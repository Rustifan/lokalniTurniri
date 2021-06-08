import { format } from "date-fns"
import React from "react"
import { Link } from "react-router-dom"
import { Segment, Image, Item, Header, Card, Icon, Label } from "semantic-ui-react"
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
            <Image src={PictureFromSport(tournament.sport)} wrapped ui={false} />
            <Card.Content>
            <Card.Header as="h2" style={{fontSize: 20}} textAlign="center">{tournament.name}</Card.Header>
            <Card.Content>
            
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                <Label style={{marginBottom: "7px"}} size="large" basic color="green"><Icon name="winner" /> {tournament.sport.toUpperCase()}</Label>
                <Label size="large" color="blue" basic><Icon name="location arrow" />  {tournament.location.formattedLocation}</Label>

            </div>


            </Card.Content>
           
     
    </Card.Content>
        </Card>
    )
}