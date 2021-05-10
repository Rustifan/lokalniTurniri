import { observer } from "mobx-react-lite"
import React from "react"
import { Table } from "semantic-ui-react";
import { Contestor } from "../../App/Interfaces/Contestor";
import { store } from "../../Stores/store";

interface Props
{
    contestors: Contestor[];
}

export default observer(function TournamentTable({contestors}: Props)
{
    const {tournamentStore: {selectedTournament}} = store;
    const tableRows = [];
    let lastContestorScore: number | null = null;
    let lastContestorPosition: number | null = null;

    for(let i = 0; i < contestors.length; i++)
    {
        const contestor = contestors[i];
        let position = 0;
        if(selectedTournament?.currentRound === 1) position = i+1;
        else
        {
            if(contestor.score === lastContestorScore) position=lastContestorPosition!;
            else position = i+1;
            lastContestorPosition = position;
            lastContestorScore = contestor.score;
        }
        const color = getRowColor(position, selectedTournament!.currentRound);
        
        tableRows.push(

            <Table.Row style={{backgroundColor: color}} textAlign="center"  key={contestor.displayName}>
            <Table.Cell>{position+"."}</Table.Cell>
            <Table.Cell>{contestor.displayName}</Table.Cell>
            <Table.Cell>{contestor.wins}</Table.Cell>
            <Table.Cell>{contestor.loses}</Table.Cell>
            <Table.Cell>{contestor.draws}</Table.Cell>
            <Table.Cell>{contestor.wins+contestor.loses+contestor.draws}</Table.Cell>
            <Table.Cell>{contestor.score}</Table.Cell>
            </Table.Row>
        )
    }

    return(
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{backgroundColor: "#2185d0", color: "white"}} colSpan="7" textAlign="center">Tablica</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Header>
                <Table.Row >
                    <Table.HeaderCell>Poredak</Table.HeaderCell>
                    <Table.HeaderCell>Natjecatelj</Table.HeaderCell>
                    <Table.HeaderCell>Pobjede</Table.HeaderCell>
                    <Table.HeaderCell>Porazi</Table.HeaderCell>
                    <Table.HeaderCell>Izjednačenja</Table.HeaderCell>
                    <Table.HeaderCell>Broj partija</Table.HeaderCell>
                    <Table.HeaderCell>Bodovi</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {tableRows}
            </Table.Body>
        </Table>
    )
});

function getRowColor(position: number, currentRound: number)
{
    if(currentRound === 1) return "transparent";
    switch(position)
    {
        case 1:
            return "#ffff99";
        case 2: 
            return "#00ffff";
        case 3:
            return "#ffb366";
        default:
            return "transparent";
    }
}