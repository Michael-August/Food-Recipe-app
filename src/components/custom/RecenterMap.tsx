import { useEffect } from "react";
import { useMap } from "react-leaflet";

const RecenterMap = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();

    useEffect(() => {
        map.setView(center);
    }, [center, zoom, map]);

    return null;
};

export default RecenterMap;
