import { Field, Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react"
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
    const fieldRef = useRef<HTMLInputElement | null>(null);
    const {messageStore: {sendMessage}} = store;
    
    useEffect(()=>{
        if(fieldRef)
        {
            fieldRef.current?.focus();
        }
    }, [fieldRef, sendTo])

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
            <Formik key={sendTo}
                initialValues={initialValue}
                onSubmit={handleSubmit}
                innerRef={formikRef}
                >
                {()=>
                (
                    <Form className="ui form">
                        <Field autocomplete="off" innerRef={fieldRef} name="messageText" onKeyPress={(handlePress)} placeholder="Pošalji poruku (Enter)"/>
                    </Form>
                    
                )}
            </Formik>       
        </Segment>
    )
});