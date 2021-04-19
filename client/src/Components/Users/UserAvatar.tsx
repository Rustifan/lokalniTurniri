import React from "react"
import { Popup, Image } from "semantic-ui-react"
import { User } from "../../App/Interfaces/User"

interface Props
{
    user: string;
    highlited?: boolean;

}

export default function({user, highlited=false}: Props)
{
    return (
        
        <Popup
            header={user}
            trigger={
            <Image 
                 avatar 
                 src="https://manskkp.lv/assets/images/users/default-user.png"
                 style={{border: highlited ? "solid red 2px" : "none"}}
                 />}
        />
        
        
    )
}