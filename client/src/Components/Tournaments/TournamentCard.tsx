import { format } from "date-fns";
import React from "react"
import { Link } from "react-router-dom";
import { Button, Icon, Image, Item, Label, List, Message, Segment } from "semantic-ui-react";
import { Tournament } from "../../App/Interfaces/Tournament";
import PictureFromSport from "../../App/Tools/pictureFromSoprt";
import UserAvatar from "../Users/UserAvatar";

interface Props {
    tournament: Tournament;
}

const lorem = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."

export default function TournamentCard({ tournament }: Props) {


    return (

        <Item style={{ marginTop: 30 }}>


            <Item.Image size="medium" src={PictureFromSport(tournament.sport)} />
            <Item.Content>
                <Item.Header style={{ fontSize: 25, padding: 10 }} as={Link} to={"/tournaments/" + tournament.id}>{tournament.name}</Item.Header>
                <Item.Meta>

                    <Label size="large" basic color="green"><Icon name="winner" /> {tournament.sport.toUpperCase()}</Label>
                    <Label size="large" color="blue" basic><Icon name="location arrow" />  {tournament.location}</Label>
                    <Message color="purple" header={"Datum održavanja: " + format(tournament.date, "dd. MM. yyyy. hh:mm")} />
                </Item.Meta>

                <Item.Description>
                    <Message info content={lorem.substr(0, 200)} />
                </Item.Description>
                <Item.Extra>
                    <Label style={{ marginRight: 10 }} basic icon="user" color="blue" pointing="right" content="Administratori" />

                    <List horizontal>

                        {tournament.admins.map(((admin, i) => (

                            <List.Item key={i}>

                                <UserAvatar user={admin} highlited={tournament.hostUsername === admin} />
                            </List.Item>)

                        ))}

                    </List>
                    <Button as={Link} to={`/tournaments/${tournament.id}`} floated="right" color="green" content="Pogledaj" />
                    <Button floated="right" primary content="Prijavi se" />
                </Item.Extra>
            </Item.Content>

        </Item>



    )
}