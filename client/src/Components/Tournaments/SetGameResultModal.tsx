import { observer } from "mobx-react-lite"
import React from "react"
import { Button, Header, Modal } from "semantic-ui-react";
import { Game } from "../../App/Interfaces/Game";
import { store } from "../../Stores/store";

interface Props
{
    game: Game;
    
}

export default observer(function SetGameResultModal({game}: Props)
{
    const {tournamentStore} = store;
    const {setGameResult, setGameResultModalOpen, setSetGameResultModalOpen, setResultLoading} = tournamentStore;
    const open = setGameResultModalOpen === game.id;
    
    function loading(button: number)
    {
        return setResultLoading === button;
    }

    function disabled()
    {
       return setResultLoading !== null;
    }

    function submit(result: number)
    {
        setGameResult(game.id, result)
    }

    return(
        <Modal style={{width: "auto"}} open={open}>
            <Modal.Header>
                <Button 
                    size="mini" 
                    negative icon="cancel" 
                    floated="right"
                    onClick={()=>setSetGameResultModalOpen(null)}
                    />
                <Header textAlign="center" as="h2">Tko je pobijedio?
                </Header>
            </Modal.Header>
            <Modal.Content>
                <div>
                <Button.Group>
                <Button 
                    color="blue" 
                    disabled={disabled()} 
                    loading={loading(1)}
                    onClick={()=>submit(1)}
                    >{game.contestor1}</Button>
                <Button 
                    color="yellow" 
                    disabled={disabled()} 
                    loading={loading(0)}
                    onClick={()=>submit(0)}
                    >Neriješeno</Button>
                <Button 
                    color="green" 
                    disabled={disabled()} 
                    loading={loading(2)}
                    onClick={()=>submit(2)}
                    >{game.contestor2}</Button>
                </Button.Group>
                </div>
               
            </Modal.Content>
        </Modal>
    )
});
