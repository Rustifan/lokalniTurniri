import { useField } from "formik";
import React from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import hr from "date-fns/locale/hr"


import { Label } from "semantic-ui-react";

interface Props
{
    name: string;
}

export default function DateInput({name}: Props)
{
    const [field, meta, helpers] = useField(name)
    registerLocale("hr", hr);
   
    

    const handleChange = (date: Date | null | [Date, Date], event: React.SyntheticEvent<any, Event>)=>
    {
        helpers.setValue(date);
        helpers.setTouched(true);
        
    }
    
    return(
        <>
            <DatePicker
                dateFormat="dd. MMMM, yyyy. '  u ' HH:mm" 
                locale={"hr"}
                showTimeInput 
                timeInputLabel="Vrijeme: "
                timeFormat="HH:mm"

                minDate={new Date()} 
                name={name} 
                selected={field.value} 
                onChange={handleChange}
                onChangeRaw={(e)=>e.preventDefault()}
                />
                
            {meta.error && meta.touched &&
            (<Label basic color="red">{meta.error}</Label>)}
            
        </>
    )
}


