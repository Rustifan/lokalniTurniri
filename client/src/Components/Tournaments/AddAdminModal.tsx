import { Form, Formik } from "formik"
import React from "react"
import { Button, Header, Modal } from "semantic-ui-react"
import TextInput from "../Forms/TextInput"
import * as Yup from "yup"
import { store } from "../../Stores/store"
import { observer } from "mobx-react-lite"


export default observer(function AddAdminModal() {
    
    const {tournamentStore} = store;
    const {addAdmin, addAdminModalOpen, setAddAdminModalOpen} = tournamentStore;

    const initialValues =
    {
        adminName: ""
    }

    const modalStyle =
    {
        maxWidth: 300
    }

    const validationSchema = Yup.object({
        adminName: Yup.string().required("Morate unijeti ime novog administratora")
    })

    return (
        <Modal open={addAdminModalOpen} style={modalStyle}>
            <Modal.Content>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={initialValues}
                    onSubmit={(value) => addAdmin(value.adminName)}>
                    
                    {({dirty, isSubmitting, isValid})=>{
                        return (

                            <Form className="ui form">

                                <Header textAlign="center" as="h2">Dodaj administartora</Header>

                                <TextInput
                                    name="adminName"
                                    placeholder="ime administratora" />
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <Button
                                        disabled={!dirty || isSubmitting || !isValid}
                                        loading={isSubmitting}
                                        style={{marginRight: 20}}
                                        positive
                                        type="submit"
                                        content="Pošalji" />
                                    <Button
                                        negative
                                        type="button"
                                        content="Odustani" 
                                        onClick={()=>setAddAdminModalOpen(false)}
                                        />

                                </div>



                            </Form>
                        )
                    }}
                    
                </Formik>
            </Modal.Content>
        </Modal>
    )
});