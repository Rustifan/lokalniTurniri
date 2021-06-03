export interface Location
{
    id?: string;
    formattedLocation: string;
    locationString: string;
    lat: number;
    lng: number;
}

export class Location
{
    constructor(lat= 0, lng=0, formattedLocation="", locationString="", id=undefined)
    {
        this.id = id;
        this.lat = lat;
        this.lng = lng;
        this.locationString = locationString;
        this.formattedLocation = formattedLocation;
        
    }
}