import { useState, useEffect } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { 
  getCurrentLocation, 
  geocodeAddress, 
  reverseGeocode, 
  getPopularIndianCities 
} from '../utils/location';

const LocationSearch = ({ onLocationSelect, currentLocation, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularCities] = useState(getPopularIndianCities());

  // Update search query when currentLocation changes
  useEffect(() => {
    if (currentLocation?.address) {
      setSearchQuery(currentLocation.address);
    }
  }, [currentLocation]);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const position = await getCurrentLocation();
      const address = await reverseGeocode(position.latitude, position.longitude);
      
      const locationData = {
        latitude: position.latitude,
        longitude: position.longitude,
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country
      };
      
      setSearchQuery(address.address);
      onLocationSelect(locationData);
      setIsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await geocodeAddress(query);
      setSearchResults([result]);
    } catch (err) {
      setError('Location not found');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location) => {
    setSearchQuery(location.formattedAddress || location.address || `${location.city}, ${location.state}`);
    onLocationSelect(location);
    setIsOpen(false);
    setSearchResults([]);
  };

  const handleCitySelect = (city) => {
    const locationData = {
      latitude: city.latitude,
      longitude: city.longitude,
      address: `${city.name}, ${city.state}`,
      city: city.name,
      state: city.state,
      country: 'India'
    };
    handleSelectLocation(locationData);
  };

  const clearLocation = () => {
    setSearchQuery('');
    onLocationSelect(null);
    setSearchResults([]);
    setError('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.length > 2) {
              handleSearchLocation(e.target.value);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search location or city..."
          className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        
        {/* Action Buttons */}
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {searchQuery && (
            <button
              onClick={clearLocation}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Clear location"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className="p-2 text-purple-600 hover:text-purple-800 disabled:opacity-50"
            title="Use current location"
          >
            <Navigation className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="p-3 text-red-600 text-sm border-b">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="p-3 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span>Searching...</span>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border-b">
              <div className="p-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Search Results
              </div>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 flex items-start space-x-3"
                >
                  <Search className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {result.city && result.state ? `${result.city}, ${result.state}` : 'Location'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.formattedAddress}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular Cities */}
          {!searchQuery && (
            <div>
              <div className="p-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Popular Cities
              </div>
              <div className="max-h-64 overflow-y-auto">
                {popularCities.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-500">{city.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && !isLoading && !error && (
            <div className="p-3 text-gray-500 text-sm text-center">
              No locations found for "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LocationSearch;
