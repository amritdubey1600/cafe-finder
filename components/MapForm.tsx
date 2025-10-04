'use client';
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

const CITIES = {
  "Mumbai": [19.0760, 72.8777] as [number, number],
  "Delhi": [28.7041, 77.1025] as [number, number],
  "Bengaluru": [12.9716, 77.5946] as [number, number],
  "Chennai": [13.0827, 80.2707] as [number, number],
  "Kolkata": [22.5726, 88.3639] as [number, number],
  "Hyderabad": [17.3850, 78.4867] as [number, number],
  "Pune": [18.5204, 73.8567] as [number, number]
};

export default function MapForm({
  updateMap,
}: {
  updateMap: (position: [number,number]) => void;
}) {
  const [city, setCity] = useState<string>("Dummy");
  const [isLocating, setIsLocating] = useState(false);

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (selectedPosition) => {
          updateMap([selectedPosition.coords.latitude, selectedPosition.coords.longitude]);
          setCity('Dummy');
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enable location permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    
    setCity(selectedCity);
    updateMap(CITIES[selectedCity as keyof typeof CITIES]);
  };

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={handleUseMyLocation}
        disabled={isLocating}
        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        <Navigation className={`w-5 h-5 relative z-10 ${isLocating ? 'animate-pulse' : ''}`} />
        <span className="relative z-10">{isLocating ? 'Locating...' : 'Use My Location'}</span>
      </button>
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Or Choose</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          Select a city
        </label>
        <div className="relative group">
          <select
            value={city}
            onChange={handleChange}
            className="w-full border-2 border-gray-200 focus:border-pink-400 rounded-xl px-4 py-3 bg-gradient-to-br from-white to-gray-50 text-gray-700 font-medium transition-all duration-300 outline-none cursor-pointer hover:border-pink-300 hover:shadow-md appearance-none"
          >
            <option value="Dummy">Select a city...</option>
            {Object.keys(CITIES).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}