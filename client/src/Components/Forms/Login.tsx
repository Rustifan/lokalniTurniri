import { Field, Form, Formik } from "formik";

import { observer } from "mobx-react-lite"
import React from "react"
import { LoginForm } from "../../App/Interfaces/User";
import {store} from "../../Stores/store"
import * as Yup from "yup"
import { Button,  Header, Modal } from "semantic-ui-react";
import TextInput from "./TextInput";

export default observer(()=>
{
    
    const {userStore} = store;


    const initialValues: LoginForm = 
    {
        email: "",
        password: ""
    };

    const validationSchema = Yup.object({
        email: Yup.string().required("Unesite email").email("Email mora biti ispravan"),
        password: Yup.string().required("Unesite svoj password")
    });
   
   

    return(
           
        <Modal centered style={{width: "50%", maxWidth: "400px"}} open={userStore.loginModalOpen}>
            <Modal.Header>
                <Header textAlign="center">Login</Header>
            </Modal.Header>
            <Modal.Content>
            <Formik  validationSchema={validationSchema} initialValues={initialValues} onSubmit={async (values)=>userStore.login(values)}>
            {({dirty, isSubmitting, isValid})=>
                (<Form className="ui form">
                  <TextInput  name="email" placeholder="email"/>
                    <TextInput name="password" type="password" placeholder="password"/>
                  <Button 
                    disabled={!dirty || isSubmitting || !isValid} 
                    loading={isSubmitting} 
                    type="submit" 
                    positive 
                    content="Login"/>
                  <Button 
                    onClick={()=>userStore.setLoginModalOpen(false)} 
                    negative type="button">Odustani</Button>
                </Form>)
            }

        </Formik>
            </Modal.Content>
        </Modal>
       
 
    )
});