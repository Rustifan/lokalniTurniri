import React from "react"
import GoogleMapReact from 'google-map-react';
import { TournamentMarker } from "../Common/TournamentMarker";


interface Props
{
    lat: number;
    lng: number;
    defaultZoom?: number;
}

export default function MapComponent({lat, lng, defaultZoom=14}: Props)
{
    return(
        <div style={{width: "100%", height: "100%"}}>
            <GoogleMapReact
                options={{fullscreenControl: false, scrollwheel: true}}
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API || "" }}
                defaultCenter={{lat, lng}}
                defaultZoom={defaultZoom}
                >
            <TournamentMarker lat={lat} lng={lng}/>

            </GoogleMapReact>
        </div>
    )
}