import { observer } from "mobx-react-lite"
import React from "react"
import { Table } from "semantic-ui-react";
import { Contestor } from "../../App/Interfaces/Contestor";

interface Props
{
    contestors: Contestor[];
}

export default observer(function TournamentTable({contestors}: Props)
{
    return(
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell style={{backgroundColor: "#2185d0", color: "white"}} colSpan="6" textAlign="center">Tablica</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Natjecatelj</Table.HeaderCell>
                    <Table.HeaderCell>Pobjede</Table.HeaderCell>
                    <Table.HeaderCell>Porazi</Table.HeaderCell>
                    <Table.HeaderCell>Izjednačenja</Table.HeaderCell>
                    <Table.HeaderCell>Broj partija</Table.HeaderCell>
                    <Table.HeaderCell>Bodovi</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {contestors.map(contestor=>(
                    <Table.Row textAlign="center"  key={contestor.displayName}>
                        <Table.Cell>{contestor.displayName}</Table.Cell>
                        <Table.Cell>{contestor.wins}</Table.Cell>
                        <Table.Cell>{contestor.loses}</Table.Cell>
                        <Table.Cell>{contestor.draws}</Table.Cell>
                        <Table.Cell>{contestor.wins+contestor.loses+contestor.draws}</Table.Cell>
                        <Table.Cell>{contestor.score}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
});