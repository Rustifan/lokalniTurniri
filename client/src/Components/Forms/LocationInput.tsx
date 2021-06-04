import { useField } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { Form, Label, Popup } from "semantic-ui-react"
import googleApi from "../../App/API/googleApi";
import { Location } from "../../App/Interfaces/Location"
import LocationInputMap from "./LocationInputMap";


interface Props {
    name: string;
    placeholder: string;
}


export default function LocationInput(props: Props) {

    const [selected, setSelected] = useState(false);
    const [field, meta, helpers] = useField(props.name);
    const [hoveringMap, setHoveringMap] = useState(false);
    const [typing, setTyping] = useState(false);
    const [inputValue, setInputValue] = useState(field.value.location);
    const [timeoutId, setTimeoutId] = useState<null | NodeJS.Timeout>(null);
    const [latLng, setLatLng] = useState<{ lat: number, lng: number } | undefined>(undefined)
    const [zoom, setZoom] = useState<number | undefined>(undefined)
    const timeToChange = 1000;
    const inputRef = useRef<HTMLInputElement | null>(null)



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
        }
        setTyping(true);
        setInputValue(event.currentTarget.value);
        const newTimeout = setTimeout(() => {
            setTyping(false)
            setTimeoutId(null);
        }, timeToChange)
        setTimeoutId(newTimeout);

    }



    const changeLocationValue = () => {

        
        
        if (inputValue && inputValue !== "") {
            googleApi.geoCode.getLocationFromAddress(inputValue)
                .then((response) => {
                    if (response.results && response.results[0]) {
                        const result = response.results[0];
                        const { formatted_address, geometry: { location: { lat, lng } } } = result;
                        const location: Location =
                        {
                            lat, lng, formattedLocation: formatted_address, locationString: inputValue
                        };
                        setLatLng({ lat, lng });
                        setZoom(14);
                        helpers.setValue(location);
                        
                    }
                })


        }
        else if (inputValue !== null && meta.touched) {
            setLatLng(undefined);
            helpers.setValue(new Location());
            
        }  
    };

    useEffect(() => {




        if (!typing && inputValue !== null) {
            changeLocationValue();
        }


    }, [typing]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(()=>
    {
        if(meta.initialValue.locationString)
        {
            setLatLng({lat: meta.initialValue.lat, lng: meta.initialValue.lng});
            setZoom(13);
        }
        if(inputRef.current)
        {
            inputRef.current.value = meta.initialValue.locationString; 
            setInputValue(meta.initialValue.locationString);
            
            
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    

    const changeLocationByLngLat = (lng: number, lat: number) => {
        googleApi.geoCode.getLocationFromLgnLat({ lng, lat }).then(response => {
            if (response.results && response.results[0]) {
                const result = response.results[0];
                const { formatted_address, geometry: { location: { lat, lng } } } = result;
                const location: Location =
                {
                    lat, lng, formattedLocation: formatted_address, locationString: formatted_address
                };



                if (inputRef.current) {
                    inputRef.current!.value = formatted_address;
                }

                helpers.setValue(location);

            }
        })
    }



    return (
        <Form.Field error={meta.error && meta.touched}>
            <Popup

                open={selected}
                content={<div
                    onMouseOver={() => setHoveringMap(true)}
                    onMouseLeave={() => setHoveringMap(false)}

                ><LocationInputMap
                        zoom={zoom}
                        latLng={latLng}
                        setLatLng={setLatLng}
                        setZoom={setZoom}
                        changeLocationByLngLat={changeLocationByLngLat} /></div>}


                hoverable



                trigger={
                    <input {...props} ref={inputRef} autoComplete="off" name="location"
                        onChange={handleChange}
                        onFocus={() => setSelected(true)}
                        
                        onBlur={() => {
                            if (hoveringMap) {
                                return inputRef.current?.focus();
                            }
                            helpers.setTouched(true);
                            setSelected(false);
                        }} />
                }
            />
            {meta.error && meta.touched &&
                (<Label basic color="red">Potrebno je unijeti lokaciju</Label>)}
        </Form.Field>
    )
}