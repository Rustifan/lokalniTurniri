import Geocode from "react-geocode";


const apiKey = process.env.REACT_APP_GOOGLE_API;
Geocode.setLanguage("hr");
if(apiKey)
{
    Geocode.setApiKey(apiKey);
}

const geoCode = 
{
    getLocationFromAddress: (location: string)=>Geocode.fromAddress(location),
    getLocationFromLgnLat: (lngLat: {lng: number, lat: number})=>Geocode.fromLatLng(lngLat.lat.toString(), lngLat.lng.toString())
}

const googleApi = 
{
    geoCode
}

export default googleApi;
