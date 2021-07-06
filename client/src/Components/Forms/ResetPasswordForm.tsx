import { Form, Formik } from "formik"
import React from "react"
import { ResetPasswordValues } from "../../App/Interfaces/ResetPasswordValues"
import * as Yup from "yup";
import TextInput from "./TextInput";
import Header from "semantic-ui-react/dist/commonjs/elements/Header";
import { Button } from "semantic-ui-react";
import { history } from "../..";
import { store } from "../../Stores/store";

interface Props
{
    username: string;
    token: string;
}

export default function ResetPasswordForm(props: Props)
{
    const {userStore: {resetPassword}} = store;

    const initialValues: ResetPasswordValues = 
    {
        password: "",
        repeatPassword: ""
    };

    const validationSchema = Yup.object({
        password: Yup.string().required("Morate unijeti novu lozinku")
            .matches(new RegExp("(?=.*[A-Z])"), "Lozinka mora sadržavati barem jedno veliko slovo")
            .matches(new RegExp("(?=.*[a-z])"), "Lozinka mora sadržavati barem jedno malo slovo")
            .matches(new RegExp("(?=.*\\d)"), "Lozinka mora sadržavati barem jednu znamenku")
            .matches(new RegExp("^.{8,16}$"), "Lozinka mora sadržavati između 8 i 16 znakova"),
        repeatPassword: Yup.string().required("Morate potvrditi novu lozinku")
            .oneOf([Yup.ref("password")], "Lozinke se moraju poklapati") 
    });

    const handleSubmit = async (values: ResetPasswordValues)=>
    {
        const resetPasswordValues: ResetPasswordValues =
        {
            ...values,
            username: props.username,
            token: props.token
        };

        await resetPassword(resetPasswordValues);

    };

    return(
        <>
        <Header 
            as="h1" 
            textAlign="center"
            style={{padding: 30}}
            >Promjena lozinke</Header>
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            >
        {({dirty, isValid, isSubmitting})=>(
            <Form 
                className="ui form"
                style={{width: 500, margin: "auto"}}
                >
                <Header sub color="blue">Unesite novu lozinku</Header>
                <TextInput name="password" placeholder="Nova lozinka" type="password"/>
                
                <Header sub color="blue">Ponovite lozinku</Header>
                <TextInput name="repeatPassword" placeholder="Ponovljena lozinka" type="password"/>

                <Button
                    type="submit"
                    content="Promijeni lozinku"
                    positive
                    loading={isSubmitting}
                    disabled={isSubmitting || !dirty || !isValid}
                    />
                
                <Button
                    type="button"
                    content="Odustani"
                    negative
                    onClick={()=>history.push("/")}
                    />

            </Form>
        )}
        </Formik>
        </>
    )
}