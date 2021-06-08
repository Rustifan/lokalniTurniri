import React from "react"
import { Popup } from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import TournamentPopup from "../TournamentPopup";
import TournamentCard from "../Tournaments/TournamentCard"

interface Props
{
    lat: number;
    lng: number;
    tournament: Tournament | undefined;
}

export function TournamentMarker({tournament}: Props)
{
    if(!tournament) return<></>;

    return(
        <Popup 
            
            style={{padding: 5}}
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