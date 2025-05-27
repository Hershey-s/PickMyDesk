import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/currency";
import { formatDistance } from "../utils/location";

function WorkspaceCard({
  id,
  title = "Downtown Workspace",
  listingImage = "https://imgs.search.brave.com/S38smYRwFSImxRktm30Z-g3mo7k97QoBj6OmRB2rKP4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2LzIyLzM0Lzk2/LzM2MF9GXzYyMjM0/OTY5OF9Qeld0bXVz/elZzNVJUQzBkTmIy/d2t1dE05ZmRqcHFF/TC5qcGc",
  location = "456 Business Avenue, San Francisco",
  country = "United States",
  avgRating = 4.7,
  tags = ["Private Office", "24/7 Access", "Printing"],
  price = 45,
  priceUnit = "hour",
  currency = "INR",
  isPopular = true,
  distance = null,
}) {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 hover:scale-105 transition-transform duration-300">
      <div className="h-full rounded-lg overflow-hidden shadow-md bg-white transition-shadow duration-300 hover:shadow-lg">
        {/* Image section */}
        <Link to={`/workspace/${id}`} className="block">
          <div
            className="relative h-48 bg-gray-200 cursor-pointer hover:opacity-95 transition-opacity"
            style={{
              backgroundImage: `url(${listingImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            title="Click to view workspace details"
          >
            {isPopular && (
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                  Popular
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <Link
              to={`/workspace/${id}`}
              className="text-lg font-medium truncate pr-2 hover:text-purple-700 hover:underline cursor-pointer transition-colors"
              title="Click to view workspace details"
            >
              {title}
            </Link>
            <div className="flex items-center flex-shrink-0">
              <Star size={16} fill="gold" color="gold" className="mr-1" />
              <span className="text-amber-500 font-medium">{avgRating}</span>
              <span className="text-gray-500 text-sm ml-1">
                {/* Only show reviews parentheses if reviews exist */}
                {typeof reviews !== "undefined" && `(${reviews})`}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-2 truncate">{location}</p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">{country}</p>
            {distance !== null && (
              <div className="flex items-center text-purple-600">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="text-xs font-medium">
                  {formatDistance(distance)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {tags &&
              tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">
                {formatPrice(price, currency)}
              </span>
              <span className="text-gray-500"> / {priceUnit}</span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/workspace/${id}`}
                className="text-gray-600 font-medium hover:underline text-sm"
              >
                View Details
              </Link>
              <Link
                to={`/book/${id}`}
                className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceCard;
