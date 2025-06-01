import { useState, useEffect } from "react";
import { Star, MapPin, Users, Zap, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      console.log("🔍 Checking authentication:", {
        hasToken: !!token,
        hasUser: !!user,
        tokenLength: token?.length,
      });

      if (!token) {
        // For non-logged users, show popular workspaces as recommendations
        console.log("👤 No token found, showing popular workspaces instead");
        await fetchPopularWorkspaces();
        return;
      }

      if (!user) {
        setError("User information not found. Please log in again.");
        setLoading(false);
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5007";
      console.log(
        "🌐 Making request to:",
        `${baseUrl}/workspaces/recommendations`
      );

      const response = await axios.get(
        `${baseUrl}/workspaces/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("🤖 Smart recommendations received:", response.data);
      setRecommendations(response.data.recommendations || []);
      setUserPreferences(response.data.userPreferences);
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);

      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (
        error.response?.status === 404 ||
        error.code === "ECONNREFUSED"
      ) {
        // Fall back to popular workspaces when recommendations API is not available
        console.log(
          "🔄 Recommendations API not available, showing popular workspaces"
        );
        await fetchPopularWorkspaces();
        return;
      } else {
        // For any other error, show error message
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load recommendations"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularWorkspaces = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5007";

      try {
        const response = await axios.get(`${baseUrl}/workspaces`);

        // Create fake recommendations from popular workspaces
        const popularWorkspaces = response.data
          .filter((ws) => ws.isPopular || ws.avgRating >= 4)
          .slice(0, 6)
          .map((workspace) => ({
            ...workspace,
            recommendationScore: workspace.isPopular ? 85 : 75,
            recommendationReasons: [
              workspace.isPopular
                ? "Popular choice among users"
                : "Highly rated workspace",
              "Great location",
              "Good value for money",
            ],
            matchPercentage: workspace.isPopular ? 85 : 75,
          }));

        setRecommendations(popularWorkspaces);
      } catch (apiError) {
        console.log("🔄 API not available, using mock data for demo");
        // Use mock data when API is not available
        const mockRecommendations = [
          {
            _id: "mock1",
            title: "Modern Co-working Space",
            location: "Mumbai",
            country: "India",
            price: 500,
            currency: "INR",
            priceUnit: "hour",
            description: "A beautiful workspace in the heart of Mumbai",
            listingImage:
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
            isPopular: true,
            avgRating: 4.5,
            maxCapacity: 10,
            tags: ["WiFi", "Coffee", "Meeting Room"],
            recommendationScore: 90,
            matchPercentage: 90,
            recommendationReasons: [
              "Popular choice among users",
              "Perfect for your team size",
              "Great location",
            ],
          },
          {
            _id: "mock2",
            title: "Creative Studio Space",
            location: "Delhi",
            country: "India",
            price: 750,
            currency: "INR",
            priceUnit: "hour",
            description: "Modern workspace with all amenities",
            listingImage:
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
            isPopular: false,
            avgRating: 4.2,
            maxCapacity: 8,
            tags: ["WiFi", "Parking", "AC"],
            recommendationScore: 85,
            matchPercentage: 85,
            recommendationReasons: [
              "Highly rated workspace",
              "Modern amenities",
              "Good value for money",
            ],
          },
          {
            _id: "mock3",
            title: "Tech Hub Workspace",
            location: "Bangalore",
            country: "India",
            price: 600,
            currency: "INR",
            priceUnit: "hour",
            description: "Perfect for tech teams and startups",
            listingImage:
              "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
            isPopular: true,
            avgRating: 4.7,
            maxCapacity: 12,
            tags: ["High-speed WiFi", "Projector", "Whiteboard"],
            recommendationScore: 88,
            matchPercentage: 88,
            recommendationReasons: [
              "Popular in tech community",
              "High-speed internet",
              "Great for presentations",
            ],
          },
        ];

        setRecommendations(mockRecommendations);
      }

      setUserPreferences({
        preferredPriceRange: { min: 0, max: 1000 },
        preferredLocations: [],
        preferredAmenities: [],
        avgGuestCount: 1,
        bookingFrequency: "new_user",
      });
      setError(null);
    } catch (error) {
      console.error("❌ Error in fetchPopularWorkspaces:", error);
      setError("Failed to load workspace recommendations");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handleBookNow = (workspaceId, e) => {
    e.stopPropagation(); // Prevent card click when clicking book button
    navigate(`/book/${workspaceId}`);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-blue-600 bg-blue-100";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Smart Recommendations
          </h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Smart Recommendations
          </h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">
            Smart Recommendations
          </h2>
        </div>
        <div className="text-center py-8">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No recommendations available yet</p>
          <p className="text-sm text-gray-500">
            Book a few workspaces to get personalized recommendations!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="text-purple-600" size={24} />
        <h2 className="text-xl font-bold text-gray-800">
          {localStorage.getItem("token")
            ? "Smart Recommendations"
            : "Popular Workspaces"}
        </h2>
        <span className="text-sm text-gray-500 ml-2">
          {localStorage.getItem("token") ? "Powered by AI" : "Trending Now"}
        </span>
      </div>

      {/* User Preferences Summary */}
      {userPreferences && userPreferences.bookingFrequency !== "new_user" && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-2">
            Your Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-purple-600 font-medium">Budget:</span>
              <p className="text-gray-700">
                {formatPrice(userPreferences.preferredPriceRange.min)} -{" "}
                {formatPrice(userPreferences.preferredPriceRange.max)}
              </p>
            </div>
            <div>
              <span className="text-purple-600 font-medium">Locations:</span>
              <p className="text-gray-700">
                {userPreferences.preferredLocations.length > 0
                  ? userPreferences.preferredLocations.join(", ")
                  : "No preference yet"}
              </p>
            </div>
            <div>
              <span className="text-purple-600 font-medium">Group Size:</span>
              <p className="text-gray-700">
                {userPreferences.avgGuestCount} people
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((workspace) => (
          <div
            key={workspace._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleWorkspaceClick(workspace._id)}
          >
            {/* Match Percentage Badge */}
            <div className="relative">
              {workspace.listingImage && (
                <img
                  src={workspace.listingImage}
                  alt={workspace.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${getMatchColor(
                  workspace.matchPercentage
                )}`}
              >
                {workspace.matchPercentage}% Match
              </div>
              {workspace.isPopular && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Popular
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {workspace.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin size={16} />
                <span className="text-sm">{workspace.location}</span>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Up to {workspace.maxCapacity} people
                  </span>
                </div>
                {workspace.avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">
                      {workspace.avgRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="text-lg font-bold text-purple-600">
                  {formatPrice(workspace.price, workspace.currency)}
                  <span className="text-sm text-gray-500 font-normal">
                    /{workspace.priceUnit}
                  </span>
                </div>
              </div>

              {/* Recommendation Reasons */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Why we recommend this:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {workspace.recommendationReasons
                    .slice(0, 3)
                    .map((reason, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWorkspaceClick(workspace._id);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => handleBookNow(workspace._id, e)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="text-center mt-6">
        <button
          onClick={fetchRecommendations}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          Refresh Recommendations
        </button>
      </div>
    </div>
  );
};

export default SmartRecommendations;
