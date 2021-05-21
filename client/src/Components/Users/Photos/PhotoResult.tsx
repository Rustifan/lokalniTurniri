import React from "react"
import { Button, Header, Icon, Image } from "semantic-ui-react"
import CSS from "csstype"
import { store } from "../../../Stores/store"
import { observer } from "mobx-react-lite";
interface Props
{
    photo: Blob;
    setStep: (step: number)=>void;
}

export default observer(function PhotoResult({photo, setStep}: Props)
{
    const {profileStore: {postImage, postingImageLoading}} = store;

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
                <Button 
                    loading={postingImageLoading}
                    disabled={postingImageLoading}
                    positive
                    onClick={()=>postImage(photo)}
                    >
                <Icon name="check" />Pošalji</Button>
            </div>
        </>
    )
});