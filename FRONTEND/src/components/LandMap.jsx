import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '300px' };

const LandMap = ({ land }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(userPos);
          calculateDistance(userPos.lat, userPos.lng, land.coordinates.lat, land.coordinates.lng);
        },
        (err) => console.error('Location error:', err)
      );
    }
  }, [land]);

  const calculateDistance = (userLat, userLng, landLat, landLng) => {
    const R = 6371; // km
    const dLat = (landLat - userLat) * Math.PI / 180;
    const dLng = (landLng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLat * Math.PI / 180) * Math.cos(landLat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = R * c;
    setDistance(dist.toFixed(2));
  };

  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: land.coordinates.lat, lng: land.coordinates.lng }}
          zoom={15}
        >
          <Marker position={{ lat: land.coordinates.lat, lng: land.coordinates.lng }} title={land.title} />
          {userLocation && <Marker position={userLocation} title="You are here" />}
        </GoogleMap>
      </LoadScript>
      {distance && <p>Distance: {distance} km</p>}
      {!userLocation && <p>Enable location for distance</p>}
    </div>
  );
};

export default LandMap;