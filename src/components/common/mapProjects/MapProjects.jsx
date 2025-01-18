import styles from './MapProjects.module.css'; // Import CSS module
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

const L = typeof window !== 'undefined' ? require('leaflet') : null;
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// Custom red icon for markers
const redIcon = L ? new L.Icon({
  iconUrl: '/images/common/location.png',
  iconRetinaUrl: '/images/common/location.png',
  iconSize: [40, 44],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

const MapProjects = ({ projects }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const geocodeProjects = async () => {
      // Get cached locations from localStorage
      let cachedLocations = JSON.parse(localStorage.getItem("geocodedLocations")) || {};
      let geocodedLocations = [];

      // Loop through projects
      for (let project of projects) {
        // If location is already cached, use it
        if (cachedLocations[project.location]) {
          geocodedLocations.push({
            ...project,
            lat: cachedLocations[project.location].lat,
            lon: cachedLocations[project.location].lon
          });
        } else {
          // Otherwise, geocode the location
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(project.location)}`
          );
          const data = await response.json();
          if (data[0]) {
            // Cache the location
            cachedLocations[project.location] = {
              lat: data[0].lat,
              lon: data[0].lon
            };

            geocodedLocations.push({
              ...project,
              lat: data[0].lat,
              lon: data[0].lon
            });

            // Save cached locations to localStorage
            localStorage.setItem("geocodedLocations", JSON.stringify(cachedLocations));
          }
        }
      }

      setLocations(geocodedLocations);
    };

    geocodeProjects();
  }, [projects]);

  return (
    <MapContainer
      center={[14.0583, 108.2772]}
      zoom={5}
      style={{ height: '100%', width: '100%', borderRadius: '10px', zIndex: 10 }}
      whenCreated={(map) => {
        if (locations.length > 0) {
          const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lon]));
          map.fitBounds(bounds);
        }
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attributionControl={false}
      />
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lon]}
          icon={redIcon}
        >
          <Popup>
            <div className={styles.popupContentWrapper}>
              <p className={styles.popupContent}>{location.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {/* Custom CSS to hide the logo */}
      <div className={styles.leafletControlAttribution}></div>
    </MapContainer>
  );
};

export default MapProjects;
