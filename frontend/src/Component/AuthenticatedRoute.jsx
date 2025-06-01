import { useEffect, useState } from "react";
import Welcome from "../Pages/Welcome/Welcome";
import UserDashboard from "../Pages/Dashboard/UserDashboard";
import AdminDashboard from "../Pages/Admin/AdminDashboard";

const AuthenticatedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 AuthenticatedRoute: Checking user authentication...");
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("✅ Found user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      console.log("ℹ️ No user found in localStorage");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is logged in, show welcome page (without navbar/footer)
  if (!user) {
    console.log("🎨 Showing Welcome page");
    return <Welcome />;
  }

  // If user is logged in, redirect based on role
  if (user.role === "admin") {
    console.log("👑 Admin user detected, redirecting to dashboard");
    // Redirect admin to their dashboard
    window.location.href = "/admin/dashboard";
    return null;
  } else {
    console.log("👤 Regular user detected, showing workspace discovery");
    // Show user dashboard (workspace discovery)
    return <UserDashboard />;
  }
};

export default AuthenticatedRoute;
