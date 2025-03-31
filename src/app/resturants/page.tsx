"use client";

import { useEffect, useState } from "react";
import { MapPin, Star, Phone, Globe, Map as MapIcon, List, X, Utensils, ArrowLeft } from "lucide-react";
import Map, { Marker, Popup } from "react-map-gl";
import { motion } from "framer-motion";

import "mapbox-gl/dist/mapbox-gl.css";
import { useResturant } from "@/hooks/useResturant";
import { toast } from "sonner";
import ResturantSkeletonCard from "@/components/skeletons/ResturantsSkeletonLoader";
import { EmptyState } from "@/components/custom/EmptyState";
import { useRouter } from "next/navigation";

const RestaurantPage = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [view, setView] = useState("list");
    const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

    const { data: restaurants, isLoading, error } = useResturant(userLocation?.lat, userLocation?.lng)
    
    const router = useRouter()

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                (error) => {
                    if (error.code === error.PERMISSION_DENIED) {
                        toast.error("Location access denied. Please enable location to find restaurants.");
                    }
                    setUserLocation(null);
                }
            );
        } else {
            toast.error("Geolocation is not supported in this browser.");
        }
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push('/')}
                className="flex items-center gap-3 w-fit text-purple-600 cursor-pointer hover:text-purple-500">
                <ArrowLeft size={12} /> Back
            </motion.span>
            <div className="flex justify-between items-center mb-6 mt-3">
                <h1 className="text-base md:text-2xl font-bold text-purple-700">Nearby Restaurants</h1>
                <div className="flex justify-center">
                    <div className="flex items-center bg-gray-200 rounded-full p-1 relative w-24">
                        <motion.div
                            className="absolute top-0 bottom-0 w-12 bg-purple-600 rounded-full"
                            initial={{ x: view === "list" ? 0 : "100%" }}
                            animate={{ x: view === "list" ? 0 : "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        <button
                            className={`relative w-12 h-8 flex items-center cursor-pointer justify-center text-gray-600 ${view === "list" ? "text-white" : ""}`}
                            onClick={() => setView("list")}
                        >
                            <List size={20} />
                        </button>
                        <button
                            className={`relative w-12 h-8 flex items-center cursor-pointer justify-center text-gray-600 ${view === "map" ? "text-white" : ""}`}
                            onClick={() => setView("map")}
                        >
                            <MapPin size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {!userLocation && <EmptyState title="📍 Location access is disabled" description="Enable location services to find nearby restaurants." icon={Utensils} />}
            {view === "list" ? (
                userLocation && !error && (isLoading || !restaurants) ?
                    <div className="grid gap-4">
                        {[...Array(5)].map((_, i) => <ResturantSkeletonCard key={i} />)}
                    </div>
                    : (
                        restaurants?.length === 0 ? <EmptyState title="No resturant found" description="Maybe you should adjust your location" icon={Utensils} /> :
                    <div className="grid gap-4">
                        {restaurants?.map((restaurant: any) => (
                            <div key={restaurant.id} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                {/* Left: Icon & Details */}
                                <div className="flex items-start sm:items-center gap-4 w-full">
                                    {/* Icon / Image Placeholder */}
                                    <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-xl">
                                        <MapPin size={24} className="text-purple-600" />
                                    </div>
                                    {/* Text Info */}
                                    <div className="flex-1">
                                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{restaurant?.tags?.name || "Unnamed Restaurant"}</h2>
                                        <p className="text-sm sm:text-base text-gray-500 flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400" /> {restaurant?.tags["addr:street"] || "No Address"}
                                        </p>
                                        {/* Buttons */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <a href={`tel:${restaurant?.tags?.phone || "#"}`} className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-purple-700 transition text-sm">
                                                <Phone size={16} />
                                                <span>Call</span>
                                            </a>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lon}`} className="flex items-center gap-2 bg-gray-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-700 transition text-sm">
                                                <MapIcon size={16} />
                                                <span>Map</span>
                                            </a>
                                            {restaurant?.tags?.website && (
                                                <a href={restaurant?.tags?.website} target="_blank" className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-700 transition text-sm">
                                                    <Globe size={16} />
                                                    <span>Website</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Rating (Stays at the bottom on mobile) */}
                                <div className="flex items-center gap-1 text-yellow-500 text-lg font-semibold mt-3 sm:mt-0">
                                    <Star size={20} /> <span>4.5</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                userLocation && <div className="w-full h-screen md:h-[800px]">
                    
                    <Map
                        initialViewState={{
                            latitude: userLocation?.lat,
                            longitude: userLocation?.lng,
                            zoom: 13,
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                        style={{ width: "100%", height: "100%" }}
                    >
                        {restaurants?.map((restaurant: any) => (
                            <Marker 
                                key={restaurant.id} 
                                latitude={restaurant.lat} 
                                longitude={restaurant.lon}
                                onClick={() => setSelectedRestaurant(restaurant)}
                            >
                                <button className="text-purple-600">
                                    <MapPin size={24} />
                                </button>
                            </Marker>
                        ))}
                        {selectedRestaurant && (
                            <Popup
                                latitude={selectedRestaurant.lat}
                                longitude={selectedRestaurant.lon}
                                closeButton={false}
                                closeOnClick={false}
                                onClose={() => setSelectedRestaurant(null)}
                                anchor="top"
                            >
                                <div className="p-4 w-64 bg-white shadow-lg rounded-xl border border-gray-200">
                                    <div className="flex items-center justify-end">
                                        <X size={12} className="cursor-pointer" onClick={() => setSelectedRestaurant(null)} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{selectedRestaurant.tags.name || "Unnamed Restaurant"}</h3>
                                    <p className="text-sm text-gray-600">{selectedRestaurant.tags["addr:street"] || "No Address Available"}</p>
                                    <div className="mt-3 flex gap-3">
                                        {selectedRestaurant?.tags?.phone && (
                                            <a href={`tel:${selectedRestaurant.tags.phone}`} className="text-purple-600 flex items-center gap-1">
                                                <Phone size={16} /> Call
                                            </a>
                                        )}
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.lat},${selectedRestaurant.lon}`}
                                            target="_blank"
                                            className="text-gray-600 flex items-center gap-1"
                                        >
                                            <MapIcon size={16} /> Directions
                                        </a>
                                        {selectedRestaurant?.tags?.website && (
                                            <a href={selectedRestaurant.tags.website} target="_blank" className="text-blue-600 flex items-center gap-1">
                                                <Globe size={16} /> Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Popup>
                        )}
                    </Map>
                </div>
            )}
        </div>
    );
};

export default RestaurantPage;
