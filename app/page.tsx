"use client";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import debounce from 'lodash.debounce';
import MapForm from "@/components/MapForm";
import CafeList from "@/components/CafeList";
import { Coffee, MapIcon } from "lucide-react";

export interface CafeType {
  id: number;
  lat: number;
  lon: number;
  name?: string
}

// Dynamically import Map to disable SSR
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

export default function Home() {
  const [cafes, setCafes] = useState<CafeType[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<CafeType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const updateMap = (selectedPosition: [number, number]) => {

    setPosition(selectedPosition);
  }

  const handleCafeClick = (cafe: CafeType) => {
    setSelectedCafe(cafe);
    setPosition([cafe.lat, cafe.lon]);
    // Close mobile menu after selecting a cafe
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const fetchCafesRef = useRef(
    debounce(async (bounds: L.LatLngBounds) => {
      setLoading(true);
      setError(null);
      try {
        const south = bounds.getSouth();
        const west = bounds.getWest();
        const north = bounds.getNorth();
        const east = bounds.getEast();

        const query = `[out:json];node["amenity"="cafe"](${south},${west},${north},${east});out;`;
        const url =
          "https://overpass-api.de/api/interpreter?data=" +
          encodeURIComponent(query);

        const res = await fetch(url);
        const data = await res.json();

        const resCafes = data.elements.map((el: {id: number; lat: number; lon: number; tags: {name?: string}}) => ({
          id: el.id,
          lat: el.lat,
          lon: el.lon,
          name: el.tags?.name,
        }));

        setCafes(resCafes);
        console.log("Fetched cafes:", resCafes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cafes:", error);
        setError("Failed to load cafes. Please wait a moment and try again.");
        setLoading(false);
      }
    }, 1000)
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fetchCafesRef.current.cancel();
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-gray-50 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`
          md:hidden fixed top-3 right-4 z-50 
           p-3 
          ${isMobileMenuOpen?'text-white':'bg-white rounded-lg shadow-lg'}
          hover:bg-gray-100 transition-colors
        `}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <MapIcon className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          md:w-1/2 lg:w-2/5
          fixed md:relative
          h-full
          w-full sm:w-96
          bg-white shadow-lg 
          flex flex-col 
          overflow-hidden
          transition-all duration-300 ease-in-out
          z-40
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r z-50 flex gap-1 items-center justify-center from-pink-500 to-rose-500 px-6 py-4 text-white">
          <Coffee className="w-7 h-7 relative bottom-0.5" />
          <h1 className="text-2xl font-bold mb-1">
            Cafe Finder
          </h1>
        </div>

        {/* Form Section */}
        <div className="p-6 border-b border-gray-200">
          <MapForm updateMap={updateMap} />
        </div>

        {/* Cafe List Section */}
        <div className="flex-1 overflow-hidden">
          <CafeList 
            cafes={cafes} 
            loading={loading} 
            error={error} 
            onCafeClick={handleCafeClick} 
          />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Map Section */}
      <div className={`
        flex-1 
        relative
        transition-all duration-300 ease-in-out
      `}>
        <Map 
          position={position} 
          fetchCafes={fetchCafesRef.current} 
          cafes={cafes} 
          loading={loading}
          selectedCafe={selectedCafe}
        />
      </div>
    </div>
  );
}