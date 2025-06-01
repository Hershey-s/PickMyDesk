import { useState, useEffect } from "react";
import WorkspaceCard from "../../Component/WorkspaceCard";
import LocationSearch from "../../Component/LocationSearch";
import axios from "axios";
import {
  sortWorkspacesByDistance,
  filterWorkspacesWithinRadius,
  formatDistance,
  calculateDistance,
} from "../../utils/location";
import { MapPin, Filter, SlidersHorizontal } from "lucide-react";

function Home() {
  const [workspaces, setWorkspaces] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Location-based filtering state
  const [userLocation, setUserLocation] = useState(null);
  const [radiusFilter, setRadiusFilter] = useState(50); // Default 50km radius
  const [sortByDistance, setSortByDistance] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5007";
        console.log("🔍 Fetching public workspaces from:", baseUrl);

        // Use regular endpoint and filter on frontend
        const response = await axios.get(`${baseUrl}/workspaces`);
        console.log("✅ Fetched all workspaces:", response.data.length);

        // Filter out admin/test workspaces for public discovery
        const publicWorkspaces = response.data.filter((workspace) => {
          // Exclude workspaces with test/admin/sample in title (case insensitive)
          const hasTestTitle = /test|admin|sample/i.test(workspace.title || "");

          // Only include workspaces with proper data
          const hasValidData =
            workspace.listingImage &&
            workspace.price > 0 &&
            workspace.description &&
            workspace.location;

          return !hasTestTitle && hasValidData;
        });

        console.log(
          "🔍 Filtered to public workspaces:",
          publicWorkspaces.length
        );

        setWorkspaces(publicWorkspaces);
        setFilteredWorkspaces(publicWorkspaces);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching public workspaces:", err);
        setError("Failed to fetch workspaces. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Filter and sort workspaces when location or filters change
  useEffect(() => {
    let filtered = [...workspaces];

    if (userLocation && userLocation.latitude && userLocation.longitude) {
      // Add distance to all workspaces
      filtered = filtered.map((workspace) => {
        let distance = null;
        if (
          workspace.coordinates?.latitude &&
          workspace.coordinates?.longitude
        ) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            workspace.coordinates.latitude,
            workspace.coordinates.longitude
          );
        }
        return { ...workspace, distance };
      });

      // Filter by radius if location is set (only filter workspaces with coordinates)
      filtered = filtered.filter((workspace) => {
        if (
          !workspace.coordinates?.latitude ||
          !workspace.coordinates?.longitude
        ) {
          return true; // Include workspaces without coordinates
        }
        return workspace.distance <= radiusFilter;
      });

      // Sort by distance if enabled
      if (sortByDistance) {
        filtered = filtered.sort((a, b) => {
          // Workspaces with distance come first, sorted by distance
          if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance;
          }
          if (a.distance !== null && b.distance === null) return -1;
          if (a.distance === null && b.distance !== null) return 1;
          return 0; // Both have no distance
        });
      }
    }

    setFilteredWorkspaces(filtered);
  }, [workspaces, userLocation, radiusFilter, sortByDistance]);

  const handleLocationSelect = (location) => {
    setUserLocation(location);
    if (location) {
      setSortByDistance(true); // Auto-enable distance sorting when location is selected
    }
  };

  const clearLocationFilter = () => {
    setUserLocation(null);
    setSortByDistance(false);
    setFilteredWorkspaces(workspaces);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-2 py-8 flex justify-center items-center">
        <p className="text-xl">Loading workspaces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-2 py-8">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Perfect Workspace
        </h1>
        <p className="text-gray-600">
          Discover workspaces near you or search by location
        </p>
      </div>

      {/* Location Search */}
      <div className="mb-6">
        <div className="max-w-2xl">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            currentLocation={userLocation}
            className="w-full"
          />
        </div>

        {/* Location Status */}
        {userLocation && (
          <div className="mt-3 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-800">
                Showing workspaces near:{" "}
                <strong>{userLocation.city || userLocation.address}</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center space-x-1"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={clearLocationFilter}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && userLocation && (
          <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Radius Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {radiusFilter}km
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusFilter}
                  onChange={(e) => setRadiusFilter(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5km</span>
                  <span>100km</span>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sortByDistance}
                      onChange={(e) => setSortByDistance(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Sort by distance
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {userLocation ? "Nearby Workspaces" : "Available Workspaces"}
          </h2>
          <p className="text-sm text-gray-600">
            {filteredWorkspaces.length} workspace
            {filteredWorkspaces.length !== 1 ? "s" : ""} found
            {userLocation && ` within ${radiusFilter}km`}
          </p>
        </div>
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-2">
            {userLocation
              ? "No workspaces found in this area"
              : "No workspaces available at the moment"}
          </p>
          {userLocation && (
            <p className="text-sm text-gray-500 mb-4">
              Try increasing the search radius or searching in a different
              location
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {filteredWorkspaces.map((workspace, index) => (
            <WorkspaceCard
              key={index}
              id={workspace._id}
              title={workspace.title}
              listingImage={workspace.listingImage}
              location={workspace.location}
              country={workspace.country}
              avgRating={workspace.avgRating}
              tags={workspace.tags || []}
              price={workspace.price}
              priceUnit={workspace.priceUnit}
              currency={workspace.currency || "INR"}
              isPopular={workspace.isPopular}
              availableFrom={workspace.availableFrom}
              availableUntil={workspace.availableUntil}
              distance={workspace.distance}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
