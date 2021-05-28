import { Field, Form, Formik, FormikProps, useFormikContext } from "formik";
import { observer } from "mobx-react-lite";
import React, { useRef } from "react"
import {  Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";


interface Props
{
    sendTo: string;
}

export default observer(function SendMessage({sendTo}: Props)
{
    const initialValue = 
    {
        messageText: ""
    }
    
    const formikRef = useRef<null | FormikProps<{messageText: string}>>(null)
    const {userStore: {sendMessage}} = store;

    const handlePress = (event: React.KeyboardEvent<HTMLInputElement>)=>
    {
        if(event.key === "Enter")
        {
            if(formikRef.current?.dirty)
            {
                formikRef.current?.submitForm();

            }
            
            event.preventDefault();
        }
    }

    const handleSubmit = (values: {messageText: string})=>
    {
        
        sendMessage(sendTo, values.messageText);
        
        formikRef.current?.setValues({messageText: ""}); 
        

        
    }

    return (
        <Segment>
            <Formik 
                initialValues={initialValue}
                onSubmit={handleSubmit}
                innerRef={formikRef}
                >
                {()=>
                (
                    <Form className="ui form">
                        
                        <Field name="messageText" onKeyPress={(handlePress)} placeholder="Pošalji poruku (Enter)"/>
                    </Form>
                    
                )}
            </Formik>       
        </Segment>
    )
});