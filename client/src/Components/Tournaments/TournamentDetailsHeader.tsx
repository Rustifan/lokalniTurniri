import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Segment, Image, Button, Item, Label} from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import PictureFromSport from "../../App/Tools/pictureFromSoprt"
import { store } from "../../Stores/store"


interface Props {
    tournament: Tournament;
}

export default observer(function TournamentDetailsHeader({ tournament }: Props) {
    const {tournamentStore} = store;
    const {isContestor, participate, participateLoading} = tournamentStore;

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
        <>
       

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
            </Segment>
            
            <Segment attached="top">
                {tournament.applicationsClosed ? 
                <Label ribbon size="large" color="red" content="Zatvorene prijave"/>
                :
                <Button 
                    onClick={store.userStore.user ? 
                        ()=>participate(tournament.id) :
                        ()=>store.userStore.setLoginModalOpen(true)}
                    loading={participateLoading}
                    disabled={participateLoading}               
                    positive={!isContestor()}
                    negative={isContestor()} 
                    content={isContestor() ? "Odjavi se" : "Prijavi se"} 
                        />
                    }
            </Segment>
        </Segment.Group>
        </>
    )
});