import userEvent from "@testing-library/user-event"
import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Segment, Image, Button, Item} from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import PictureFromSport from "../../App/Tools/pictureFromSoprt"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"
import AddContestorModal from "./AddContestorModal"


interface Props {
    tournament: Tournament;
}

export default observer(function TournamentDetailsHeader({ tournament }: Props) {
    const {tournamentStore} = store;
    const {isContestor, participate, participateLoading, setAddContestorModalOpen} = tournamentStore;
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const imageSegmanetStyle =
    {

        padding: 0,
        height: 400,
        overflow: "hidden"
    }

    const imageStyle =
    {
        position: "absolute",
        filter: "brightness(30%)"
    }

    const headerSegmentStyle =
    {
       
        position: "relative",
        top: "50%",
        left: "5%"
        
    }

    const itemStyle = 
    {
        color: "white"
    }

    const sportStyle=
    {
        fontSize: 20,
        fontWeight: "bold",
        paddingBottom: 10,
        marginTop: 35
    }

    

    return (
        <>
        <YesNoModal question="Dali zaista želite izbrisati turnir?" 
                loading={tournamentStore.tournamentLoading} 
                setOpen={setDeleteModalOpen} 
                open={deleteModalOpen}
                onSubmit={()=>tournamentStore.deleteTournament(tournament.id)}
                />
        <AddContestorModal/>

            <Segment.Group>
            <Segment attached="bottom" clearing style={imageSegmanetStyle}>
                <Image fluid style={imageStyle} src={PictureFromSport(tournament.sport)} />
                <Segment style={headerSegmentStyle} basic>
                    <Item  style={itemStyle}>
                        <Item.Header as="h1">{tournament.name}</Item.Header>
                        <Item.Meta style={sportStyle}>{tournament.sport.toUpperCase()}</Item.Meta>
                        <Item.Extra>{format(tournament.date, "dd.  mm.  yyyy")}</Item.Extra>
                    </Item>

                    
                </Segment>
            </Segment>
            <Segment attached="top">
                
                <Button 
                    onClick={store.userStore.user ? 
                        ()=>participate(tournament.id) :
                         ()=>store.userStore.setLoginModalOpen(true)}
                    loading={participateLoading}
                    disabled={participateLoading}               
                    positive={!isContestor()}
                    negative={isContestor()} 
                    content={isContestor() ? "Odjavi se" : "Prijavi se"} 
                        />
                {tournamentStore.isAdmin() &&
                <>
                <Button
                    color="green"
                    content="Dodaj natjecatelja"
                    onClick={()=>setAddContestorModalOpen(true)}

                    />
                <Button 
                    floated="right"
                    negative 
                    content="Izbriši"
                    onClick={()=>setDeleteModalOpen(true)}
                    
                    />
                <Button 
                    as={Link} 
                    to={`/tournaments/${tournament.id}/edit`} 
                    color="blue" content="Uredi"
                    floated="right"
                    />

                </>
                }
            </Segment>
        </Segment.Group>
        </>
    )
});