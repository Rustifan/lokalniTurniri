import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Header, Modal } from "semantic-ui-react";
import { store } from "../../Stores/store";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { agent } from "../../App/agent";

export default observer(function ForgotPassword()
{
    const {userStore} = store;

    const [emailSent, setEmailSent] = useState(false);

    const initialValues = 
    {
        email: ""
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Morate unijeti valjani email")
            .required("Morate unijeti email")
    })

    const handleSubmit = async (values: {email: string})=>
    {
        await agent.Users.forgotPassword(values);
        setEmailSent(true);
    }

    return(
        <Modal
            centered
            style={{width: "50%", maxWidth: "400px"}} 
            open={userStore.forgotPasswordModalOpen}>
       
        {!emailSent ? 
        <>
        <Modal.Header>
            <Header textAlign="center">Zaboravljena lozinka</Header>
        </Modal.Header>
        <Modal.Content>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
                >
                {({dirty, isSubmitting, isValid})=>(
                    <Form className="ui form">
                        <Header sub color="blue">Unesite vaš email</Header>
                        <TextInput name="email" placeholder="email"/>
                        <Button 
                            positive
                            content="Pošalji"
                            type="submit"
                            loading={isSubmitting}
                            disabled={!dirty || isSubmitting || !isValid}
                            />
                        <Button
                            negative
                            type="button"
                            content="Odustani"
                            onClick={()=>userStore.setForgotPasswordModalOpen(false)}
                            />
                    </Form>
                )}
            </Formik>
            
        </Modal.Content>
        </>
        :
        <>
        <Modal.Header>
            <Header textAlign="center">Email poslan</Header>
        </Modal.Header>
        <Modal.Content>
            <div>
                Pogledajte u svoj inbox.
            </div>
            <div>
                Poslali smo vam email s uputama za promjenu lozinke.
            </div>
            <Button
                style={{marginTop:20}}
                content="Pokušaj ponovno"
                color="blue"
                onClick={()=>setEmailSent(false)}
                />
            <Button
                content="Uredu"
                positive
                onClick={()=>userStore.setForgotPasswordModalOpen(false)}
                />
        </Modal.Content>
        </> 
        }
        </Modal>
    )
});