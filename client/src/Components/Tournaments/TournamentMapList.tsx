import React, { useRef, useState } from "react"
import GoogleMapReact from 'google-map-react';
import { store } from "../../Stores/store";
import useSupercluster from "use-supercluster";
import { observer } from "mobx-react-lite";
import ClusterMarker from "../Common/ClusterMarker";
import { TournamentMarker } from "../Common/TournamentMarker";


export default observer(function TournamentMapList() {
    const { tournamentStore: { paginatedList, tournamentMap } } = store;
    const defaultZoom = 7;

    const [bounds, setBounds] = useState<number[] | null>(null);
    const [zoom, setZoom] = useState<number>(defaultZoom);
    const defaultCenter: GoogleMapReact.Coords = {
        lat: 45,
        lng: 16.5
    };
    const mapRef = useRef<any>();
    const tournamentGeoJsonList = paginatedList.map((tournament) => {
        return {
            type: "Feature",
            properties: {
                cluster: false,
                id: tournament.id,
                name: tournament.name,
                sport: tournament.sport
            },
            geometry: {
                type: "Point",
                coordinates: [tournament.location.lng, tournament.location.lat]
            }
        }
    });

    const {clusters, supercluster} = useSupercluster({
        points: tournamentGeoJsonList,
        bounds,
        zoom,
        options: {radius: 75, maxZoom: 20}
    })


    return (
        <div className="borderShadow" style={{ width: "100%", height: "90%", marginTop: "10px" }}>
            <GoogleMapReact
                options={{scrollwheel: true, fullscreenControl: false}}
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API || "" }}
                onChange={({ bounds, zoom }) => {
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat
                    ]);
                    setZoom(zoom);
                }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map }) => mapRef.current = map}
            >
                {clusters.map(cluster=>
                {
                    const [lng, lat] = cluster.geometry.coordinates;
                    const {
                        cluster: isCluster,
                        point_count: pointCount
                      } = cluster.properties;
                      if (isCluster) {
                      
                        return(
                            <ClusterMarker 
                                
                                key={`cluster-${cluster.id}`}
                                lng={lng} 
                                lat={lat} 
                                pointsLength={tournamentGeoJsonList.length}
                                pointCount={pointCount}
                                onClick={() => {
                                    const expansionZoom = Math.min(
                                      supercluster.getClusterExpansionZoom(cluster.id),
                                      20
                                    );
                                    mapRef.current.setZoom(expansionZoom);
                                    mapRef.current.panTo({ lat, lng });
                                  }}
                                />
                        )
                    }

                    return(
                        <TournamentMarker tournament={tournamentMap.get(cluster.properties.id)} lng={lng} lat={lat}/>
                    )
                    
                })}
            </GoogleMapReact>
        </div>
    )
});