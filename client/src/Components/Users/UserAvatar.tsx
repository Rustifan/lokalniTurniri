import React from "react"
import { Popup, Image, SemanticSIZES } from "semantic-ui-react"
import { userIcon } from "../../App/Core/Constants"

interface Props
{
    user: string;
    highlited?: boolean;
    size?: SemanticSIZES;
}

export default function UserAvatar({user, highlited=false, size=undefined}: Props)
{
    return (
        
        <Popup
            header={user}
            trigger={
            <Image 
                 size={size}
                 avatar 
                 src={userIcon}
                 style={{border: highlited ? "solid red 2px" : "none"}}
                 />}
        />
        
        
    )
}