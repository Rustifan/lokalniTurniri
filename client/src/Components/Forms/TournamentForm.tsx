import { Form, Formik } from "formik"
import React from "react"
import { Button, Header } from "semantic-ui-react"
import { TournamentFormValues } from "../../App/Interfaces/Tournament"
import DateInput from "./DateInput"
import TextInput from "./TextInput"
import * as Yup from "yup"
import { history } from "../.."

interface Props
{
    header: string,
    initialValues: TournamentFormValues,
    onSubmit: (values: TournamentFormValues)=>void;
    sendButtonContent?: string;
}

export default function CreateTournamentForm({initialValues, onSubmit, header, sendButtonContent="Pošalji"}: Props)
{

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
        <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={onSubmit}>
            {({dirty, isSubmitting, isValid})=>
            (<Form style={{marginTop: 30}} className="ui form">
                <Header as="h1">{header}</Header>
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
                    content={sendButtonContent}
                    loading={isSubmitting}
                    disabled={!dirty || isSubmitting || !isValid}
                    />
                <Button
                    negative
                    type="button"
                    onClick={()=>history.goBack()}
                    content="Odustani"
                    />
            </Form>
            )}
        </Formik>
    )
}