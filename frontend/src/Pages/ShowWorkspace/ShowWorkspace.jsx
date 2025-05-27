import { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatPrice } from "../../utils/currency";
import LocationMap from "../../Component/LocationMap";
import AvailabilityCalendar from "../../Component/AvailabilityCalendar";

export default function ShowWorkspace() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Handle time slot selection from calendar
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  useEffect(() => {
    const fetchWorkspaceDetails = async () => {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      try {
        const response = await axios.get(`${baseUrl}/workspaces/${id}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch workspace details");
        }

        setWorkspace(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load workspace details. Please try again later.");
        setLoading(false);
      }
    };

    if (id) {
      fetchWorkspaceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium">Loading workspace details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium">Workspace not found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      {/* Navigation */}
      <nav>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm">
            <Link to={"/"} className="text-gray-600 hover:text-purple-700">
              Home
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-purple-700 font-medium">
              {workspace.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-2">
          <h2 className="text-2xl font-bold">{workspace.title}</h2>
        </div>
        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div
            className="col-span-3 bg-gray-200 h-80 rounded-lg flex items-center justify-center text-4xl text-gray-400"
            style={{
              backgroundImage: workspace.listingImage
                ? `url(${workspace.listingImage})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!workspace.listingImage && "Main Image"}
          </div>
        </div>

        {/* About this space */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">About this space</h2>
          <p className="text-gray-600 mb-4">
            {workspace.description || "No description available"}
          </p>
        </div>

        {/* Space Highlights */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Space highlights</h2>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {workspace.tags && workspace.tags.length > 0 ? (
              workspace.tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center"
                >
                  <CheckCircle className="text-purple-700 w-6 h-6 mb-2" />
                  <span>{tag}</span>
                </div>
              ))
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <CheckCircle className="text-purple-700 w-6 h-6 mb-2" />
                  <span>High-Speed WiFi</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <CreditCard className="text-purple-700 w-6 h-6 mb-2" />
                  <span>Easy Payments</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <Sparkles className="text-purple-700 w-6 h-6 mb-2" />
                  <span>Premium Amenities</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center">
                  <Clock className="text-purple-700 w-6 h-6 mb-2" />
                  <span>24/7 Access</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Workspace Booking */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Book This Workspace</h2>
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{workspace.title}</h3>
                <p className="text-gray-600">
                  {workspace.location}, {workspace.country}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-purple-700">
                  {formatPrice(workspace.price, workspace.currency || "INR")}
                </span>
                <span className="text-gray-500 ml-1">
                  /{workspace.priceUnit}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{workspace.description}</p>
            <Link
              to={`/book/${workspace._id}`}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-medium text-center block"
            >
              Book Now -{" "}
              {formatPrice(workspace.price, workspace.currency || "INR")} per{" "}
              {workspace.priceUnit}
            </Link>
          </div>
        </div>

        {/* Availability Calendar */}
        <AvailabilityCalendar
          workspace={workspace}
          onTimeSelect={handleTimeSlotSelect}
        />

        {/* Quick Book Button */}
        {selectedTimeSlot && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Selected Time Slot</h3>
                <p className="text-gray-600">
                  {selectedTimeSlot.date.toLocaleDateString()} at{" "}
                  {selectedTimeSlot.displayTime}
                </p>
              </div>
              <Link
                to={`/book/${workspace._id}?date=${
                  selectedTimeSlot.date.toISOString().split("T")[0]
                }&time=${selectedTimeSlot.time}`}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Book This Time
              </Link>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <div className="mb-4">
            <p className="text-gray-600 mb-2">
              📍 {workspace.location}, {workspace.country}
            </p>
          </div>
          <LocationMap
            latitude={workspace.coordinates?.latitude}
            longitude={workspace.coordinates?.longitude}
            address={`${workspace.location}, ${workspace.country}`}
            title={workspace.title}
            height="300px"
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
}
