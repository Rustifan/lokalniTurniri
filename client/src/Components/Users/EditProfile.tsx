import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Button, Container, Header } from "semantic-ui-react";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import * as Yup from "yup"
import TextInput from "../Forms/TextInput";
import TextAreaInput from "../Forms/TextAreaInput";
import { history } from "../..";
import ChangePasswordModal from "./ChangePasswordModal";

interface Params {
    username: string;
}

export default function EditProfile() {
    const { profileStore: { getProfile }, userStore: { setChangePasswordModalOpen } } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const { username } = useParams<Params>();
    useEffect(() => {
        if (!username) return;
        getProfile(username).then(value => setProfile(value));
    }, [username, setProfile, getProfile]);

    if (!profile)
        return (
            <Container style={{ height: 200, marginTop: 50 }}>
                <LoadingComponent text="Učitavanje profila" />
            </Container>
        )
    const validationSchema = Yup.object({
        username: Yup.string().required("Korisničko ime je obavezno"),
        email: Yup.string().required("Email je obavezan"),
        bio: Yup.string()
    })

    const initialValues =
    {
        username: profile.username,
        email: profile.email,
        bio: profile.bio ? profile.bio : ""
    };

    return (
        <>
            <ChangePasswordModal />
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => store.userStore.editUser(values)}
                validationSchema={validationSchema}
            >
                {({ dirty, isValid, isSubmitting }) => (


                    <Form className="ui form">
                        <Header textAlign="center" style={{ padding: 20 }} as="h1">Uredi korisnički profil</Header>
                        <Header color="blue" sub>Korisničko Ime</Header>
                        <TextInput name="username" placeholder="korisničko ime" />

                        <Header color="blue" sub>Email</Header>
                        <TextInput name="email" placeholder="email" />

                        <Header color="blue" sub>O korisniku</Header>
                        <TextAreaInput rows={4} name="bio" placeholder="Napišite nešto o sebi" />

                        <Button
                            disabled={!dirty || !isValid || isSubmitting}
                            loading={isSubmitting}
                            positive
                            type="submit"
                            content="Pošalji"
                        />
                        <Button
                            content="Poništi"
                            type="button"
                            negative
                            onClick={() => history.goBack()}
                        />
                        <Button
                            content="Promijeni lozinku"
                            type="button"
                            color="blue"
                            floated="right"
                            onClick={()=>setChangePasswordModalOpen(true)}
                        />


                    </Form>
                )}

            </Formik>
        </>
    )
}