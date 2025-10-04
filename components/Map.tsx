"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CafeType } from "@/app/page";
import { useEffect, useState } from "react";
import FlyToLocation from "@/utils/FlyToLocation";
import { MarkerWithPopup } from "./MarkerWithPopup";
import MapEventHandler from "@/utils/MapEventHandler";
import { MapContainer, TileLayer } from "react-leaflet";
import { Maximize2, Minimize2, Lightbulb } from "lucide-react";
import DefaultMapScreen from "./DefaultMapScreen";

export default function Map({ position, cafes, fetchCafes, loading, selectedCafe }: { 
  position: [number,number] | null; 
  cafes: CafeType[];
  fetchCafes: (bounds: L.LatLngBounds) => void;
  loading?: boolean;
  selectedCafe?: CafeType | null;
}) 
{
  const [flyToLocation, setFlyToLocation] = useState<[number, number] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setFlyToLocation(position);
  },[position]);

  const toggleFullscreen = () => {
    const mapElement = document.getElementById('map-container');
    
    if (!document.fullscreenElement) {
      mapElement?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes (e.g., when user presses ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if(!position){
    return <DefaultMapScreen />;
  }

  return (
    <div id="map-container" className="relative w-full h-full bg-gray-100">
      {/* Top Info Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[10] bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              {loading? <span>Loading...</span>: <span>{cafes.length} cafe{cafes.length !== 1 ? 's' : ''} found</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-3 right-4 z-[10] flex flex-col gap-2">
        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="bg-white hover:bg-gray-100 p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 group"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Map Tip */}
      <div className="absolute hidden sm:visible bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-pink-500" />
          <p className="text-xs text-gray-600">
            <span className="font-medium">Tip:</span> Pan or zoom the map to discover more cafes
          </p>
        </div>
      </div>

      <MapContainer
        center={[20, 0]}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cafes.map((cafe) => (
          <MarkerWithPopup 
            key={cafe.id} 
            cafe={cafe} 
            isSelected={selectedCafe?.id === cafe.id}
          />
        ))}

        <MapEventHandler onBoundsChange={fetchCafes} />
        <FlyToLocation location={flyToLocation} />
      </MapContainer>
    </div>
  );
}