import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import React from "react"
import { Link } from "react-router-dom";
import { Button, Icon,  Item, Label, List, Message } from "semantic-ui-react";
import { Tournament } from "../../App/Interfaces/Tournament";
import PictureFromSport from "../../App/Tools/pictureFromSoprt";
import UserPopup from "../Users/UserPopup";

interface Props {
    tournament: Tournament;
}


export default observer(function TournamentCard({ tournament }: Props) {


    return (

        <Item style={{ marginTop: 30 }}>


            <Item.Image size="medium" src={PictureFromSport(tournament.sport)} />
            <Item.Content>
                <Item.Header style={{ fontSize: 25, padding: 10 }} as={Link} to={"/tournaments/" + tournament.id}>{tournament.name}</Item.Header>
                <Item.Meta>

                    <Label size="large" basic color="green"><Icon name="winner" /> {tournament.sport.toUpperCase()}</Label>
                    <Label tag color="teal" size="large" style={{float: "right"}}>{tournament.contestorNum+" "+(tournament.contestorNum===1?"natjecatelj":"natjecatelja")}</Label>
                    <Label style={{marginTop: "5px"}} size="large" color="blue" basic><Icon name="location arrow" />  {tournament.location.formattedLocation}</Label>
                    <Message color="purple" header={"Datum održavanja: " + format(tournament.date, "dd. MM. yyyy. hh:mm")} />

                </Item.Meta>

                <Item.Description>
                    <Message info content={tournament.description} />
                </Item.Description>
                <Item.Extra>
                    <Label style={{ marginRight: 10 }} basic icon="user" color="blue" pointing="right" content="Administratori" />

                    <List horizontal>

                        {tournament.admins.map(((admin, i) => (

                            <List.Item key={i}>

                                <UserPopup user={admin} highlited={tournament.hostUsername === admin} />
                            </List.Item>)

                        ))}

                    </List>
                    <Button as={Link} to={`/tournaments/${tournament.id}`} floated="right" color="green" content="Pogledaj" />
                </Item.Extra>
            </Item.Content>

        </Item>



    )
});