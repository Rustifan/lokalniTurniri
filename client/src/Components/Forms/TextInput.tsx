import { useField } from "formik"
import React from "react"
import { Form, Label } from "semantic-ui-react"

interface Props
{
    name: string;
    placeholder: string;
    value?: string;
    type?: string;
}


export default function TextInput(props: Props)
{
    const [field, meta] = useField(props.name)
    
    return(
        <Form.Field error={meta.error && meta.error}>
        
            <input {...field} {...props}/>
            {meta.error && meta.touched &&
            (<Label basic color="red">{meta.error}</Label>)}
        </Form.Field>
    )
}