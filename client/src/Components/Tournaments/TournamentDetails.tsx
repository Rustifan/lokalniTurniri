import { observer } from "mobx-react-lite";
import React, { useEffect } from "react"
import { useParams } from "react-router"
import { Divider } from "semantic-ui-react";
import { store } from "../../Stores/store";
import TournamentCard from "./TournamentCard";

interface Params
{
    id: string;
}

export default observer(function TournamentDetails()
{
    const {id} = useParams<Params>();
    const {tournamentStore: {selectTornament, selectedTournament, deselectTournament, tournamentLoading}} = store;
    useEffect(()=>
    {
        selectTornament(id);

        return deselectTournament;
    }, [selectTornament])

  
    if(tournamentLoading) return (<div>load</div>)
    return(
            <>
            {selectedTournament && <TournamentCard key={selectedTournament.id} tournament={selectedTournament}/>}
            </>
        
    )
});