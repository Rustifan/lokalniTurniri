import React from "react"
import { Dropdown } from "semantic-ui-react"
import Message from "../../App/Interfaces/Message"
import CSS from "csstype"
import { store } from "../../Stores/store"

interface Props
{
    message: Message;
    style?: CSS.Properties | null;
}

export default function MessageOptions({message, style=null}: Props)
{
    const {messageStore: {deleteMessage}} = store;

    return(
        <Dropdown style={style ? style : null}>
            <Dropdown.Menu>
                <Dropdown.Item onClick={()=>deleteMessage(message.id)} text="Izbriši"/>
            </Dropdown.Menu>
        </Dropdown>
    )
}