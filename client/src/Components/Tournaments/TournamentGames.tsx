import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Accordion, Grid, Header, Icon, Segment } from "semantic-ui-react";
import { Tournament } from "../../App/Interfaces/Tournament";
import { store } from "../../Stores/store";
import GameComponent from "./GameComponent";

interface Props
{
    tournament: Tournament;
}

export default observer(function TournamentGames({tournament}: Props) {
    
    
    const {tournamentStore: {gamesByRound}} = store;
    const [roundsOpenAccordion, setRoundsOpenAccordion] = useState<boolean[]>([]);
    
    useEffect(()=>
    {
        const roundsOpenInitial = [];

        for(let i = 1; i<=tournament.currentRound; i++)
        {
            if(i === tournament.currentRound)
            {
                roundsOpenInitial.push(true);
            }
            else
            {
            
                roundsOpenInitial.push(false);
            }
        
        }
        setRoundsOpenAccordion(roundsOpenInitial);
    }, [tournament.currentRound, setRoundsOpenAccordion])
    

    
    console.log(roundsOpenAccordion);
        
    
    
    const rounds = [];
    const games = gamesByRound;
    
    for(let i = 1; i <= tournament.currentRound; i++)
    {
        rounds.push(
            <Segment key={i}>
                <Accordion>
                    <Accordion.Title onClick={()=>setRoundsOpenAccordion(values=>
                        {
                            return values.map((value, index)=>
                                {
                                    if(index === i-1)
                                    {
                                        value = !value;
                                    }
                                    return value;
                                });
                            
                        })}>
                        <Header as="h3"><Icon name="dropdown"/>{i} runda</Header>
                    </Accordion.Title>
                    <Accordion.Content active={roundsOpenAccordion[i-1]}>
                        <Grid>
                            {games[i].map((game, index)=>(
                                <Grid.Column key={game.id} width="4">
                                    <GameComponent key={index} game={game}/>
                                </Grid.Column>
                            ))}
                        </Grid>
                    </Accordion.Content>
                </Accordion>
            </Segment>
        )
    }

    return (
        <Segment.Group>
            <Segment clearing inverted color="teal">
                <Header textAlign="center" as="h3">Partije</Header>
            </Segment>
            {rounds}
        </Segment.Group>
    )
});