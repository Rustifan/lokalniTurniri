import { observer } from "mobx-react-lite";
import React, { useState } from "react"
import { Button, Header, Label, Segment } from "semantic-ui-react";
import { Game } from "../../App/Interfaces/Game";
import { store } from "../../Stores/store";
import SetGameResultModal from "./SetGameResultModal";

interface Props
{
    game: Game;
}

export default observer(function GameComponent({game}: Props)
{
    const [adminOptionHeight, setAdminOptionHeight] = useState(0);
    const {tournamentStore} = store;
    const {isAdmin, setSetGameResultModalOpen, } = tournamentStore;

    function HandleHover()
    {
        if(isAdmin())
        {
            setAdminOptionHeight(60);

        }   
    }

    const adminOptionStyle=
    {
        height: adminOptionHeight, 
        overflow: "hidden",
        transition: "height 1s"
    }

    const [contestor1Score, contestor2Score] = calculateScores(game.result);
    
    return(
        <div onMouseEnter={HandleHover} onMouseLeave={()=>setAdminOptionHeight(0)}>
        <SetGameResultModal 
            game={game} 
           
            />
        <Segment.Group>
            
            <Segment>
                <Header sub as="h5">{game.contestor1}
                    <Label color={scoreToColor(contestor1Score)} style={{float: "right"}}>{contestor1Score}</Label>
                </Header>
                
            </Segment>
            
            <Segment>
                <Header sub as="h5">{game.contestor2}
                    <Label color={scoreToColor(contestor2Score)} style={{float: "right"}}>{contestor2Score}</Label>
                </Header>
            </Segment>
            <div style={adminOptionStyle}>
                <Segment>
                    <Button 
                        onClick={()=>
                        {
                            setAdminOptionHeight(0);
                            setSetGameResultModalOpen(game.id);
                        }} 
                        positive 
                        fluid 
                        basic>{game.result === -1 ? "Kako je završilo?" : "Promijeni rezultat"}</Button>
                </Segment>
            </div> 
        </Segment.Group>
        </div>

    )
});


function calculateScores(result: number)
{
    switch(result)
    {
        case -1:
            return [0,0];
        case 0:
            return [0.5,0.5];
        case 1:
            return [1, 0];
        case 2:
            return [0,1];
        default:
            return [0,0];
        
    }
}

function scoreToColor(score: number)
{
    switch(score)
    {
        case 0:
            return "grey";
        case 0.5:
            return "yellow";
        case 1:
            return "green";
    
    }
}