import React from "react"
import { Link } from "react-router-dom"
import { Header, Item, Segment } from "semantic-ui-react"
import { userIcon } from "../../App/Core/Constants"
import { Contestor } from "../../App/Interfaces/Contestor"

interface Props {
    contestors: Contestor[];
}

export default function TournamentDetailsContestors({ contestors }: Props) {
    return (


        <Segment.Group>
            <Segment color="blue" inverted attached="bottom">
                <Header as="h3" textAlign="center">Natjecatelji</Header>
            </Segment>
            <Segment clearing>
                <Item.Group divided>
                    {contestors.map((contestor) => (

                        <Item as={contestor.username? Link: Item}>
                            <Item.Image size="tiny" src={userIcon} />
                            <Item.Content>
                                <Header>
                                    {contestor.displayName}
                                </Header>
                            </Item.Content>
                        </Item>

                    ))}
                </Item.Group>
            </Segment>
        </Segment.Group>
    )
}
