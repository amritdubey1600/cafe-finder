import { useEffect, useRef } from "react";
import { CafeType } from "@/app/page";
import { Marker, Popup } from "react-leaflet";
import { Coffee, MapPin } from "lucide-react";
import { customMarkerIcon } from "@/utils/MarkerIcon";

export function MarkerWithPopup({ cafe, isSelected }: { cafe: CafeType; isSelected: boolean }) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[cafe.lat, cafe.lon]}
      icon={customMarkerIcon}
    >
      <Popup>
        <div className="p-2">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-pink-500" />
            <div className="font-semibold text-gray-800">{cafe.name || "Unnamed Cafe"}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{cafe.lat.toFixed(4)}, {cafe.lon.toFixed(4)}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
