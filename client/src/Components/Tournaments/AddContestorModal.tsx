import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Header, Modal } from "semantic-ui-react";
import { AddContestor } from "../../App/Interfaces/AddContestor";
import { store } from "../../Stores/store"
import TextInput from "../Forms/TextInput";
import * as Yup from "yup";

export default observer(function AddContestorModal()
{
    const {tournamentStore: {addContestorModalOpen, setAddContestorModalOpen, addContestor}} = store;

    const InitialValues: AddContestor = 
    {
        name: "",
        isGuest: false
    }

    const modalStyle =
    {
        maxWidth: 300
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Morate unijeti ime natjecatelja"),
        isGuest: Yup.boolean()
    })

    return(
        <Modal style={modalStyle} open={addContestorModalOpen}>
            <Formik 
                validationSchema={validationSchema} 
                initialValues={InitialValues} 
                onSubmit={(values)=>addContestor(values)}>
                {({dirty, isSubmitting, isValid})=>(
                    <Modal.Content>
                    <Header textAlign="center" as="h2">Dodaj natjecatelja</Header>
                    <Form className="ui form">
                        <Header sub>Ime natjecatelja</Header>
                        <TextInput name="name" placeholder="ime"/>

                        <Header sub>Dali je natjecatelj gost?</Header>
                        <TextInput name="isGuest" placeholder="gost" type="checkbox"/>
                        
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Button
                                loading={isSubmitting}
                                disabled={!dirty || isSubmitting || !isValid} 
                                style={{marginRight: 20}} 
                                type="submit" 
                                content="Dodaj" positive/>
                            <Button type="button" content="Odustani" negative onClick={()=>setAddContestorModalOpen(false)}/>
                        </div>
                        
                    </Form>
                    </Modal.Content>
                )}
            </Formik>
        </Modal>
    )
});