import React from "react"
import { Button, Container, Modal } from "semantic-ui-react"

interface Props
{
    question: string;
    onSubmit: ()=>void;
    open: boolean;
    setOpen: (open: boolean)=>void;
    loading? :boolean;
    yes?: string;
    no?: string;
}

export default function YesNoModal({setOpen,yes="Da", no="Ne", question, onSubmit, open, loading=false}:Props)
{
    
    return(
        <Modal style={{width: "auto"}} open={open}>
            <Modal.Header>{question}</Modal.Header>
            <Modal.Content style={{display: "flex", justifyContent: "center"}} >
                                
                <Button 
                    style={{marginRight: 40, minWidth: 70}}
                    positive 
                    content={yes} 
                    onClick={onSubmit}
                    loading={loading}
                    disabled={loading}
                    />
                <Button 
                    style={{minWidth: 70}} 
                    negative content={no} 
                    onClick={()=>setOpen(false)}
                    disabled={loading}
                    />
                

            </Modal.Content>
        </Modal>
    )
}