import { Form, Formik } from "formik"
import React from "react"
import { Button, Header } from "semantic-ui-react"
import { CreateTournament } from "../../App/Interfaces/Tournament"
import DateInput from "./DateInput"
import TextInput from "./TextInput"
import * as Yup from "yup"
import { store } from "../../Stores/store"

export default function CreateTournamentForm()
{
    const {tournamentStore} = store;

    const initialValues: CreateTournament= 
    {
        name: "",
        sport: "",
        location: "",
        date: new Date(),
        numberOfRounds: 0
    }

    const validationSchema = Yup.object({
        name: Yup.string().required("Potrebno je unijeti naziv turnira"),
        sport: Yup.string().required("Potrebno je unijeti sport u kojem se održava turnir"),
        location: Yup.string().required("Potrebno je mjesto održavanja turnira"),
        date: Yup.date()
            .required("Potrebno je unijeti datum održavanja turnira"),
            
        numberOfRounds: Yup.number()
            .required("Potrebno je unijeti broj rundi turnira")
            .min(1, "Mora biti minimalno jedna runda")
    })

    return(
        <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={tournamentStore.createTournament}>
            {({dirty, isSubmitting, isValid})=>
            (<Form className="ui form">
                <Header as="h1">Kreiraj turnir</Header>
                <Header color="blue" sub>Naziv Turnira</Header>
                <TextInput name="name" placeholder="Naziv turnira"/>

                <Header color="blue" sub>Sport</Header>
                <TextInput name="sport" placeholder="Sport"/>

                <Header color="blue" sub>Lokacija</Header>
                <TextInput name="location" placeholder="Lokacija"/>
                
                <Header color="blue" sub>Datum početka turnira</Header>
                <DateInput name="date"/>
                
                <Header color="blue" sub>Broj rundi</Header>
                <TextInput type="number" name="numberOfRounds" placeholder="Broj rundi"/>

                <Button 
                    positive 
                    type="submit" 
                    content="Pošalji"
                    loading={isSubmitting}
                    disabled={!dirty || isSubmitting || !isValid}
                    />
            </Form>
            )}
        </Formik>
    )
}