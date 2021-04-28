import React from "react"
import { Dimmer, Loader, Segment } from "semantic-ui-react"

interface Props
{
    text?: string;
}

export default function LoadingComponent({text = "Loading"}: Props)
{
    return(
        
    <Segment style={{height: "100%"}}>
            <Dimmer active inverted>
                <Loader inverted>{text}</Loader>
            </Dimmer>
    </Segment>
        
    )
}