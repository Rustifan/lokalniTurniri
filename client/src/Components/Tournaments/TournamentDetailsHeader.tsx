import { format } from "date-fns"
import React from "react"
import { Segment, Image, Button, Item, Header } from "semantic-ui-react"
import { textSpanContainsTextSpan } from "typescript"
import { Tournament } from "../../App/Interfaces/Tournament"
import PictureFromSport from "../../App/Tools/pictureFromSoprt"

interface Props {
    tournament: Tournament;
}

export default function TournamentDetailsHeader({ tournament }: Props) {
    const imageSegmanetStyle =
    {

        padding: 0,
        height: 400,
        overflow: "hidden"
    }

    const imageStyle =
    {
        position: "absolute",
        filter: "brightness(30%)"
    }

    const headerSegmentStyle =
    {
       
        position: "relative",
        top: "50%",
        left: "5%"
        
    }

    const itemStyle = 
    {
        color: "white"
    }

    const sportStyle=
    {
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 10,
        marginTop: 35
    }

    

    return (

        <Segment.Group>
            <Segment attached="bottom" clearing style={imageSegmanetStyle}>
                <Image fluid style={imageStyle} src={PictureFromSport(tournament.sport)} />
                <Segment style={headerSegmentStyle} basic>
                    <Item  style={itemStyle}>
                        <Item.Header as="h1">{tournament.name}</Item.Header>
                        <Item.Meta style={sportStyle}>{tournament.sport.toUpperCase()}</Item.Meta>
                        <Item.Extra>{format(tournament.date, "dd.  mm.  yyyy")}</Item.Extra>
                    </Item>

                    
                </Segment>
                <Button></Button>
            </Segment>
            <Segment attached="top"><Button positive content="Prijavi se" /></Segment>
        </Segment.Group>

    )
}