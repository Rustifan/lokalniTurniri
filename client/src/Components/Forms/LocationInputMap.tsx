import React from "react";
import GoogleMapReact from 'google-map-react';
import { GoogleMapPin } from "./GoogleMapPin";

interface Props {
    changeLocationByLngLat: (lng: number, lat: number) => void;
    zoom: number | undefined,
    latLng: {lat: number, lng: number} | undefined;
    setZoom: (zoom: number | undefined)=>void;
    setLatLng: (latLng: {lat: number, lng: number})=>void;

}

export default function LocationInputMap(props: Props) {
    const defaultCenter: GoogleMapReact.Coords = {
        lat: 45,
        lng: 16.5
    };
    const defaultZoom = 6;
   

 
    return (
        <div style={{ width: "300px", height: "300px" }}>
            <GoogleMapReact
                
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API || "" }}
                defaultCenter={defaultCenter}
                center={props.latLng}
                defaultZoom={defaultZoom}
                zoom={props.zoom}
                onClick={(value)=>
                {
                    props.setLatLng({lat: value.lat, lng: value.lng});
                    props.changeLocationByLngLat(value.lng, value.lat);
                }}
                onChange={(value)=>
                {
                    props.setZoom(value.zoom);
                    
                }}
                
               
                
                options={{ fullscreenControl: false, scrollwheel: true }}

            >
            {props.latLng &&
                <GoogleMapPin lat={props.latLng.lat} lng={props.latLng.lng}/>
            } 
            </GoogleMapReact>
        </div>
    )
}