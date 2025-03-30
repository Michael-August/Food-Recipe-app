'use client'

import { useEffect, useState } from "react";
import { MapPin, Star, Phone, Globe, Map, List } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const RestaurantPage = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [userLocation, setUserLocation] = useState(null);
    const [view, setView] = useState("list");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                fetchRestaurants(latitude, longitude);
            });
        }
    }, []);

    const fetchRestaurants = async (lat, lng) => {
        const query = `[out:json];node["amenity"="restaurant"](around:5000,${lat},${lng});out;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setRestaurants(data.elements);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-700">Nearby Restaurants</h1>
                <div className="flex justify-center mb-6">
                    <div className="flex items-center bg-gray-200 rounded-full p-1 relative w-24">
                        <motion.div 
                            className="absolute top-0 bottom-0 w-12 bg-purple-600 rounded-full"
                            initial={{ x: view === 'list' ? 0 : '100%' }}
                            animate={{ x: view === 'list' ? 0 : '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        <button 
                            className={`relative w-12 h-8 flex items-center cursor-pointer justify-center text-gray-600 ${view === 'list' ? 'text-white' : ''}`}
                            onClick={() => setView('list')}
                        >
                            <List size={20} />
                        </button>
                        <button 
                            className={`relative w-12 h-8 flex items-center cursor-pointer justify-center text-gray-600 ${view === 'map' ? 'text-white' : ''}`}
                            onClick={() => setView('map')}
                        >
                            <MapPin size={20} />
                        </button>
                    </div>
                </div>
            </div>
            {view === "list" ? (
                <div className="grid gap-4">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="bg-white p-4 rounded-lg shadow-lg flex gap-4">
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-800">{restaurant?.tags?.name || "Unnamed Restaurant"}</h2>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <MapPin size={16} /> {restaurant?.tags["addr:street"] || "No Address"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <a href={`tel:${restaurant?.tags?.phone || "#"}`} className="bg-purple-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                        <Phone size={16} />
                                    </a>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lon}`} className="bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                        <Map size={16} />
                                    </a>
                                    {restaurant?.tags?.website && (
                                        <a href={restaurant?.tags?.website} target="_blank" className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
                                            <Globe size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} /> <span>4.5</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <MapContainer center={userLocation || [0, 0]} zoom={13} className="h-96 w-full rounded-lg shadow-lg">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {restaurants.map((restaurant) => (
                        <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lon]}>
                            <Popup>
                                <strong>{restaurant.tags.name || "Unnamed Restaurant"}</strong>
                                <p>{restaurant.tags["addr:street"] || "No Address"}</p>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            )}
        </div>
    );
};

export default RestaurantPage;
