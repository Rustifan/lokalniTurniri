import { observer } from "mobx-react-lite";
import React from "react"
import { Icon, Segment } from "semantic-ui-react";
import { Contestor } from "../../App/Interfaces/Contestor";

interface Props
{
    contestors: Contestor[];
}

export default observer(function Winners({contestors}: Props)
{
    const winners = [contestors[0]];

    for(let i = 1; i < contestors.length; i++)
    {
        if(contestors[i].score === winners[0].score)
        {
            winners.push(contestors[i]);
        }
        else
        {
            break;
        }
    }
    const anouncment = winners.length ===1 ? "Pobjednik je: ": "Pobjednici su: ";
    const winnersStyle = {fontSize: 50};

    return(
        <Segment style={{display: "flex", justifyContent: "center",alignItems: "center", flexDirection: "column"}}>
            
            <div>
                <Icon size="massive" color="yellow" name="winner"/>
            </div>
            <div style={{marginTop:20, fontSize: 50}}>
                {anouncment}
            </div>
            <div style={{marginTop: 40, color: "gold"}}>
            {winners.map((winner, index)=>(
                <>
                <span style={winnersStyle}>{winner.displayName.toUpperCase()}</span>
                { index < winners.length-2 &&
                    <span style={winnersStyle}>{", "}</span>
                }
                {
                    index === winners.length-2 &&
                    <span style={winnersStyle}>{" i "}</span>
                }
                </>
            ))}
            </div>
        </Segment>
    )

});