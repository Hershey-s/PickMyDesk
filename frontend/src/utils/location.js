// Location utility functions for nearby workspace features

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Get user's current location using browser geolocation
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Geocode an address to get coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<{latitude: number, longitude: number, formattedAddress: string}>}
 */
export const geocodeAddress = async (address) => {
  try {
    // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('Address not found');
    }
    
    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      formattedAddress: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village,
      state: result.address?.state,
      country: result.address?.country,
      zipCode: result.address?.postcode
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get address
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<{address: string, city: string, state: string, country: string}>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Reverse geocoding service unavailable');
    }
    
    const data = await response.json();
    
    return {
      address: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      state: data.address?.state,
      country: data.address?.country,
      zipCode: data.address?.postcode
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Sort workspaces by distance from a given location
 * @param {Array} workspaces - Array of workspace objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} Sorted workspaces with distance property
 */
export const sortWorkspacesByDistance = (workspaces, userLat, userLon) => {
  return workspaces
    .map(workspace => {
      // Calculate distance if workspace has coordinates
      let distance = null;
      if (workspace.coordinates?.latitude && workspace.coordinates?.longitude) {
        distance = calculateDistance(
          userLat, 
          userLon, 
          workspace.coordinates.latitude, 
          workspace.coordinates.longitude
        );
      }
      
      return {
        ...workspace,
        distance
      };
    })
    .sort((a, b) => {
      // Sort by distance (null distances go to end)
      if (a.distance === null && b.distance === null) return 0;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
};

/**
 * Filter workspaces within a certain radius
 * @param {Array} workspaces - Array of workspace objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Array} Filtered workspaces within radius
 */
export const filterWorkspacesWithinRadius = (workspaces, userLat, userLon, radiusKm = 50) => {
  return workspaces.filter(workspace => {
    if (!workspace.coordinates?.latitude || !workspace.coordinates?.longitude) {
      return true; // Include workspaces without coordinates
    }
    
    const distance = calculateDistance(
      userLat, 
      userLon, 
      workspace.coordinates.latitude, 
      workspace.coordinates.longitude
    );
    
    return distance <= radiusKm;
  });
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return 'Distance unknown';
  }
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  } else if (distance < 10) {
    return `${distance.toFixed(1)}km away`;
  } else {
    return `${Math.round(distance)}km away`;
  }
};

/**
 * Get popular Indian cities with coordinates for quick selection
 * @returns {Array} Array of city objects with coordinates
 */
export const getPopularIndianCities = () => {
  return [
    { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Delhi', state: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
    { name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
    { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
    { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
    { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
    { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
    { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873 },
    { name: 'Surat', state: 'Gujarat', latitude: 21.1702, longitude: 72.8311 },
    { name: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462 },
    { name: 'Kanpur', state: 'Uttar Pradesh', latitude: 26.4499, longitude: 80.3319 },
    { name: 'Nagpur', state: 'Maharashtra', latitude: 21.1458, longitude: 79.0882 },
    { name: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577 },
    { name: 'Thane', state: 'Maharashtra', latitude: 19.2183, longitude: 72.9781 },
    { name: 'Bhopal', state: 'Madhya Pradesh', latitude: 23.2599, longitude: 77.4126 },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185 },
    { name: 'Pimpri-Chinchwad', state: 'Maharashtra', latitude: 18.6298, longitude: 73.7997 },
    { name: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376 },
    { name: 'Vadodara', state: 'Gujarat', latitude: 22.3072, longitude: 73.1812 }
  ];
};

export default {
  calculateDistance,
  getCurrentLocation,
  geocodeAddress,
  reverseGeocode,
  sortWorkspacesByDistance,
  filterWorkspacesWithinRadius,
  formatDistance,
  getPopularIndianCities
};
