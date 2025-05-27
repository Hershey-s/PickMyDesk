import { MapPin, ExternalLink } from 'lucide-react';

const StaticMap = ({ 
  latitude, 
  longitude, 
  address, 
  title = "Workspace Location",
  height = "300px" 
}) => {
  // Default to Delhi coordinates if no coordinates provided
  const defaultLat = 28.6139;
  const defaultLng = 77.2090;
  
  const lat = latitude || defaultLat;
  const lng = longitude || defaultLng;

  // Generate OpenStreetMap static image URL
  const mapImageUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  
  // Google Maps link for opening in external app
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  
  // OpenStreetMap link
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden border border-gray-200">
      {/* Map Container */}
      <div className="relative h-full">
        <iframe
          src={mapImageUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={`Map showing ${title}`}
          loading="lazy"
        />
        
        {/* Overlay with location info */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-start space-x-2">
            <MapPin className="w-5 h-5 text-purple-700 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
              {address && (
                <p className="text-xs text-gray-600 mt-1">{address}</p>
              )}
            </div>
          </div>
        </div>

        {/* External links */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </a>
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
            title="Open in OpenStreetMap"
          >
            <MapPin className="w-4 h-4 text-gray-600" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaticMap;
