import React from "react"
import { Header } from "semantic-ui-react"

interface Props
{
    bio?: string;
}

export default function ProfileBio({bio}: Props)
{
    return(
        <>
            <Header as="h2">O korisniku</Header>
            <div style={{whiteSpace: "pre-wrap"}}>
                {bio}
            </div>
        </>
    )
}