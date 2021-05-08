import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Button, Header, Item, Segment } from "semantic-ui-react"
import { userIcon } from "../../App/Core/Constants"
import { AddContestor } from "../../App/Interfaces/AddContestor"
import { Contestor } from "../../App/Interfaces/Contestor"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"

interface Props {
    contestors: Contestor[];
}

export default observer( function TournamentDetailsContestors({ contestors }: Props) {

    const {tournamentStore: {removeContestor, participateLoading, isAdmin, selectedTournament}} = store;
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [contestorToRemove, setContestorToRemove] = useState<Contestor | null>(null);

    const handleTryRemoveContestor = (contestor: Contestor)=>
    {
        setRemoveModalOpen(true);
        setContestorToRemove(contestor);
    }

    const handleRemoveContestor = async ()=>
    {
        if(!contestorToRemove) return;

        const values: AddContestor =
        {
            name: contestorToRemove.displayName,
            isGuest: contestorToRemove.username === null
        }
        await removeContestor(values);
        setRemoveModalOpen(false);

        
    }


    
    return (

        <>
        <YesNoModal 
            question="Dali stvarno želite izbaciti natjecatelja sa turnira"
            open={removeModalOpen}
            setOpen={setRemoveModalOpen}
            onSubmit={handleRemoveContestor}
            loading={participateLoading}
            />
        <Segment.Group>
            <Segment color="blue" inverted attached="bottom">
                <Header as="h3" textAlign="center">Natjecatelji</Header>
            </Segment>
            <Segment clearing>
                <Item.Group divided>
                    {contestors.map((contestor) => (

                        <Item key={contestor.displayName}>
                            <Item.Image size="tiny" src={userIcon} />
                            <Item.Content>
                                <Header>
                                    {contestor.displayName}
                                </Header>
                            </Item.Content>
                                {isAdmin() && !selectedTournament?.applicationsClosed &&
                                <Button 
                                    size="small"
                                    compact 
                                    key={contestor.displayName} 
                                    content="Izbaci" negative
                                    style={{ height: "30%", alignSelf: "bottom"}}
                                    onClick={()=>handleTryRemoveContestor(contestor)}
                                    />}
                            

                           
                        </Item>

                    ))}
                </Item.Group>
            </Segment>
        </Segment.Group>
        </>
    )
})
