import { Form, Formik } from "formik"
import React from "react"
import { Button, Header, Message, Modal } from "semantic-ui-react"
import { RegisterForm } from "../../App/Interfaces/User"
import * as Yup from "yup"
import TextInput from "./TextInput"
import { store } from "../../Stores/store"
import { observer } from "mobx-react-lite"

export default observer(function Register()
{
    const {userStore} = store;
    const {registerModalOpen, setRegisterModalOpen, register} = userStore;

    const initialValues: RegisterForm =
    {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    }

    const validationSchema = Yup.object({
        username: Yup.string().required("Unesite svoje korisničko ime"),
        email: Yup.string().required("Unesite svoj email").email("Email mora biti ispravan"),
        password: Yup.string().required("Unesite svoju lozinku")
            .matches(new RegExp("(?=.*[A-Z])"),"Lozinka mora sadržavati barem jedno veliko slovo")
            .matches(new RegExp("(?=.*[a-z])"),"Lozinka mora sadržavati barem jedno malo slovo")
            .matches(new RegExp("(?=.*\\d)"),"Lozinka mora sadržavati barem jednu znamenku")
            .matches(new RegExp("^.{8,16}$"),"Lozinka mora sadržavati između 8 i 16 znakova"),
            

        
        confirmPassword: Yup.string().required("Ponovite svoju lozinku").oneOf([Yup.ref("password")],"Lozinke se moraju poklapati")
    }) 

    return(
        <Modal style={{width: "50%", maxWidth: "400px"}} open={registerModalOpen}>
            <Modal.Header>
                <Header textAlign="center">Registriraj se</Header>
            </Modal.Header>
            <Modal.Content>
                <Formik 
                    validationSchema={validationSchema} 
                    initialValues={initialValues} 
                    onSubmit={(values)=>register(values)}>
                    {({dirty, isValid, isSubmitting})=>
                    (
                        <Form className="ui form">
                            <TextInput name="username" placeholder="username"/>
                            <TextInput name="email" placeholder="email"/>
                            <TextInput name="password" placeholder="lozinka" type="password"/>
                            <TextInput name="confirmPassword" placeholder="ponovljena lozinka" type="password"/>
                            <Button
                                positive 
                                type="submit"
                                content="Registriraj se"
                                loading={isSubmitting}
                                disabled={!dirty && !isValid && isSubmitting}
                                />
                            <Button negative content="Odustani" onClick={()=>setRegisterModalOpen(false)}/>
                        </Form>
                    )}            
                </Formik>
                {
                    store.errorStore.loginRegisterError &&
                    <Message 
                        error
                        onDismiss={store.errorStore.removeLoginRegisterError}>
                            {store.errorStore.loginRegisterError}
                    </Message>
                }
            </Modal.Content>
        </Modal>
    )
});