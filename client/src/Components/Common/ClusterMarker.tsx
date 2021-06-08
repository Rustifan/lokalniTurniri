import React from "react"

interface Props {
    lat: number;
    lng: number;
    pointsLength: number;
    pointCount: number;
    onClick?: ()=>void;

}

export default function ClusterMarker({ pointCount, pointsLength, onClick }: Props) {
    return (
        <div
            className="cluster-marker"
            style={{
                width: `${20 + (pointCount / pointsLength) * 50}px`,
                height: `${20 + (pointCount / pointsLength) * 50}px`
            }}
            onClick={onClick}
            >
        {pointCount}
        </div>
    )
}