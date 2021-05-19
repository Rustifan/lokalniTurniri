import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import React from "react"
import { Button, Header, Message, Modal } from "semantic-ui-react";
import { ChangePasswordForm } from "../../App/Interfaces/User";
import { store } from "../../Stores/store";
import TextInput from "../Forms/TextInput";
import * as Yup from "yup"

export default observer(function ChangePasswordModal() {

    const { userStore: { changePasswordModalOpen, setChangePasswordModalOpen } } = store;

    const initialValues: ChangePasswordForm =
    {
        oldPassword: "",
        newPassword: "",
        repeatPassword: ""
    };

    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Morate unijeti staru lozinku"),
        newPassword: Yup.string().required("Morate unijeti novu lozinku")
            .matches(new RegExp("(?=.*[A-Z])"), "Lozinka mora sadržavati barem jedno veliko slovo")
            .matches(new RegExp("(?=.*[a-z])"), "Lozinka mora sadržavati barem jedno malo slovo")
            .matches(new RegExp("(?=.*\\d)"), "Lozinka mora sadržavati barem jednu znamenku")
            .matches(new RegExp("^.{8,16}$"), "Lozinka mora sadržavati između 8 i 16 znakova"),
        repeatPassword: Yup.string().required("Morate potvrditi novu lozinku")
            .oneOf([Yup.ref("newPassword")], "Lozinke se moraju poklapati")
    });

    return (
        <Modal style={{ width: 400 }} open={changePasswordModalOpen}>
            <Modal.Header>
                <Header textAlign="center" as="h2">Promijeni Lozinku</Header>
            </Modal.Header>
            <Modal.Content>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(values) => store.userStore.changePassword(values)}
                    validationSchema={validationSchema}
                >
                    {({ dirty, isValid, isSubmitting }) => {
                        return (
                            <Form className="ui form">
                                <Header sub color="blue">Stara lozinka</Header>
                                <TextInput name="oldPassword" placeholder="Stara lozinka" type="password" />

                                <Header sub color="blue">Nova lozinka</Header>
                                <TextInput name="newPassword" placeholder="Nova lozinka" type="password" />

                                <Header sub color="blue">Ponovljena lozinka</Header>
                                <TextInput name="repeatPassword" placeholder="Ponovljena lozinka" type="password" />
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button
                                        positive
                                        type="submit"
                                        content="Promijeni Lozinku"
                                        disabled={!dirty || !isValid || isSubmitting}
                                        loading={isSubmitting}
                                    />
                                    <Button
                                        style={{ marginLeft: 20 }}
                                        type="button"
                                        content="Odustani"
                                        negative
                                        onClick={() => {
                                            setChangePasswordModalOpen(false);
                                            store.errorStore.removeLoginRegisterError();
                                        }}
                                    />


                                </div>
                            </Form>
                        );
                    }

                    }
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