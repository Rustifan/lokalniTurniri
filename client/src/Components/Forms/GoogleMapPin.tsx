import React from "react"

export function GoogleMapPin(props: any)
{


    return(
        <div style={{display: "flex", justifyContent: "center", alignContent: "center" }}>
            
            <img 
            alt="Map pin"
            style={{
                width: "40px",
                height: "40px",
                transform: "translate(0px, -40px)"
            }} 
            src="/Assets/Images/mapPin.png" />
            
        </div>
    )
}