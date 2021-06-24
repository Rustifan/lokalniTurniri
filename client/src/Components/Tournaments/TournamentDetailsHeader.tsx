import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { useRef, useState } from "react"
import { Segment, Image, Button, Item, Label} from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import PictureFromSport from "../../App/Tools/pictureFromSoprt"
import { store } from "../../Stores/store"
import CSS from "csstype";
import MapComponent from "../Map/MapComponent"

interface Props {
    tournament: Tournament;
}

export default observer(function TournamentDetailsHeader({ tournament }: Props) {
    
    const {tournamentStore} = store;
    const {isContestor, participate, participateLoading, 
            isTournamentFinnished} = tournamentStore;
    const [showMap, setShowMap] = useState(false);
    const mapHeight = "500px";
    const handleShowMap = 
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>
    {
        event.currentTarget.blur();
        setShowMap(value=>!value);
    }
    
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
    
    const mapSegmentStyle: CSS.Properties=
    {
        overflow: "hidden",
        transition: "height 1s",
        height: showMap ? mapHeight : "0px"
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
                        <Item.Extra>
                            {format(tournament.date, "dd.  mm.  yyyy 'u' HH:MM")}
                            <span style={{position: "absolute", right: "80px", top: "25px" }}>{"BROJ RUNDI: " +tournament.numberOfRounds}</span>
                            
                            <Button 
                                active={showMap}
                                onClick={handleShowMap}
                                style={{marginLeft: 20}} 
                                inverted 
                                icon="location arrow" 
                                content={tournament.location.formattedLocation} 
                                />
                       
                        </Item.Extra>
                    </Item>

                    
                </Segment>
            </Segment>
            
            <div style={mapSegmentStyle}>
            <Segment style={{width: "100%", height: mapHeight, padding: 0}}>
                <MapComponent 
                    lat={tournament.location.lat} 
                    lng={tournament.location.lng}/>
            </Segment>
            </div>            

           
            <Segment attached="top">
                {tournament.applicationsClosed ? 
                <Label 
                    ribbon 
                    size="large" 
                    color={tournament.currentRound===0?"red":"blue"} 
                    content={tournament.currentRound ===0 ? "Zatvorene Prijave": 
                        isTournamentFinnished ? "Turnir je završen!" : "U tijeku je "+tournament.currentRound+". runda."}/>
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