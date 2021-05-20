import React from "react"
import { Button, Header, Icon, Image } from "semantic-ui-react"
import CSS from "csstype"
interface Props
{
    photo: Blob;
    setStep: (step: number)=>void;
}

export default function PhotoResult({photo, setStep}: Props)
{
    const imgStyle: CSS.Properties =
    {
        width: "500px",
        height: "500px",
        margin: "auto",
        border: "black 5px solid"
    }

    return(
        <>
            <Header style={{ padding: 20 }} textAlign="center" as="h2">Pošalji Sliku</Header>
            <Image style={imgStyle} src={URL.createObjectURL(photo)}></Image>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setStep(2)} negative><Icon name="x" />Uredi drugačije</Button>
                <Button  positive><Icon name="check" />Pošalji</Button>
            </div>
        </>
    )
}