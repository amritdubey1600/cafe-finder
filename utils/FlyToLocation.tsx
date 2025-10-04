import { useMap } from "react-leaflet";
import { useEffect } from "react";

// Component to handle flying to a location
export default function FlyToLocation({ location }: { location: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 13, { duration: 1.5 });
    }
  }, [location, map]);

  return null;
}