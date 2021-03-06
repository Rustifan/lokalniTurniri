import React from "react"
import { Popup } from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import TournamentPopup from "../TournamentPopup";

interface Props
{
    lat: number;
    lng: number;
    tournament?: Tournament | undefined;
}

export function TournamentMarker({tournament}: Props)
{
    if(!tournament) return <img 
    alt="Map pin"
    style={{
        width: "40px",
        height: "40px",
        
    }} 
    src="/Assets/Images/tournamentCup.png" />;

    return(
        <Popup 
            
            style={{padding: 0}}
            hoverable
            basic
            trigger={

            <div style={{display: "flex", justifyContent: "center", alignContent: "center" }}>
            
            <img 
            alt="Map pin"
            style={{
                width: "40px",
                height: "40px",
                
            }} 
            src="/Assets/Images/tournamentCup.png" />
            
        </div>
        }
        content={<TournamentPopup tournament={tournament}/>}
        />

        
        
    )
}