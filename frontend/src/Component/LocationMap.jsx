import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import StaticMap from "./StaticMap";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMap = ({
  latitude,
  longitude,
  address,
  title = "Workspace Location",
  height = "300px",
  zoom = 15,
}) => {
  const mapRef = useRef();
  const [mapError, setMapError] = useState(false);

  // Default to Delhi coordinates if no coordinates provided
  const defaultLat = 28.6139;
  const defaultLng = 77.209;

  const lat = latitude || defaultLat;
  const lng = longitude || defaultLng;

  useEffect(() => {
    // Invalidate map size when component mounts to ensure proper rendering
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, []);

  // If there's an error loading the interactive map, show static map
  if (mapError) {
    return (
      <StaticMap
        latitude={lat}
        longitude={lng}
        address={address}
        title={title}
        height={height}
      />
    );
  }

  try {
    return (
      <div
        style={{ height, width: "100%" }}
        className="rounded-lg overflow-hidden"
      >
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-purple-700">{title}</h3>
                {address && (
                  <p className="text-sm text-gray-600 mt-1">{address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error("Error rendering map:", error);
    return (
      <StaticMap
        latitude={lat}
        longitude={lng}
        address={address}
        title={title}
        height={height}
      />
    );
  }
};

export default LocationMap;
