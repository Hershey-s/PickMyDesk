import { useState, useEffect } from "react";
import WorkspaceCard from "../../Component/WorkspaceCard";
import axios from "axios";

function Home() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await axios.get(`${baseUrl}/workspaces`);
        setWorkspaces(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch workspaces. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

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
      <p className="text-2xl font-bold mb-6 px-2">Available Workspaces</p>

      {workspaces.length === 0 ? (
        <p className="text-lg px-2">No workspaces available at the moment.</p>
      ) : (
        <div className="flex flex-wrap -mx-2">
          {workspaces.map((workspace, index) => (
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
              isPopular={workspace.isPopular}
              availableFrom={workspace.availableFrom}
              availableUntil={workspace.availableUntil}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
