import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

// Button component used within the NavBar
const Button = ({ link, name, styles = "" }) => {
  return (
    <NavLink to={link}>
      <button
        className={`px-3 py-1 hover:bg-purple-100 hover:text-purple-800 rounded-full font-bold ${styles}`}
      >
        {name}
      </button>
    </NavLink>
  );
};

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    console.log("🔍 NavBar useEffect - Token:", !!token);
    console.log("🔍 NavBar useEffect - UserData:", userData);

    setIsLoggedIn(!!token);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("🔍 NavBar useEffect - Parsed User:", parsedUser);
      setUser(parsedUser);
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Add a listener for storage changes to update navbar when user logs in
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log("🔄 Storage changed - Token:", !!token);
      console.log("🔄 Storage changed - UserData:", userData);

      setIsLoggedIn(!!token);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("🔄 Storage changed - Parsed User:", parsedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for changes (in case storage event doesn't fire)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <header className="h-18">
        <nav
          className={`flex border border-transparent hover:border-gray-200 justify-between items-center px-2 md:pr-6 py-4 fixed hover:bg-purple-50 right-0 left-0 z-10
            ${scrolled ? "bg-purple-50" : "bg-white"}`}
        >
          <div className="flex pl-3 items-center">
            <h1 className="text-2xl font-extrabold text-black">
              <NavLink
                to={user?.role === "admin" ? "/admin/dashboard" : "/workspaces"}
                className="flex flex-col"
              >
                <span className="text-xl font-bold">PickMyDesk</span>
                <span className="text-xs text-gray-500 -mt-1">
                  Desk booking, simplified
                </span>
              </NavLink>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-3">
            {/* Home button - different for admins and users */}
            {user?.role === "admin" ? (
              <Button
                link={"/admin/dashboard"}
                name={"Dashboard"}
                styles="bg-gray-100"
              />
            ) : (
              <Button link={"/"} name={"Home"} styles="bg-gray-100" />
            )}

            {/* Admin-only options */}
            {user?.role === "admin" && (
              <>
                <Button link={"/new"} name={"Create Workspace"} />
              </>
            )}

            {/* User-only options */}
            {user?.role === "user" && isLoggedIn && (
              <Button link={"/bookings"} name={"My Bookings"} />
            )}

            {!isLoggedIn ? (
              <>
                <Button
                  link={"/user/login"}
                  name={"User Login"}
                  styles="bg-blue-100"
                />
                <Button
                  link={"/admin/login"}
                  name={"Admin Login"}
                  styles="bg-purple-100"
                />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user?.role === "admin" ? "👨‍💼" : "👤"} {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-red-500 px-3 py-1 hover:bg-gray-200 hover:text-purple-800 rounded-full font-bold"
                >
                  LogOut
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex gap-3">
            {!isLoggedIn ? (
              <Button
                link={"/login"}
                name={<User size={20} />}
                styles="bg-gray-200 rounded-full flex px-2"
              />
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-red-500 px-3 py-1 hover:bg-gray-200 hover:text-purple-800 rounded-full font-bold"
              >
                LogOut
              </button>
            )}

            <button
              className="lg:hidden focus:outline-none h-6 pl-4"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden flex flex-col gap-3 bg-white shadow-md absolute top-20 left-0 right-0 p-4 z-10">
            {/* Home button - different for admins and users */}
            {user?.role === "admin" ? (
              <Button
                link={"/admin/dashboard"}
                name={"Dashboard"}
                styles="bg-gray-100"
              />
            ) : (
              <Button link={"/"} name={"Home"} styles="bg-gray-100" />
            )}

            {/* Admin-only options */}
            {user?.role === "admin" && (
              <>
                <Button link={"/new"} name={"Create Workspace"} />
              </>
            )}

            {/* User-only options */}
            {user?.role === "user" && isLoggedIn && (
              <Button link={"/bookings"} name={"My Bookings"} />
            )}

            {!isLoggedIn ? (
              <>
                <Button
                  link={"/user/login"}
                  name={"User Login"}
                  styles="bg-blue-100"
                />
                <Button
                  link={"/admin/login"}
                  name={"Admin Login"}
                  styles="bg-purple-100"
                />
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-600">
                  {user?.role === "admin" ? "👨‍💼 Admin" : "👤 User"}:{" "}
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-red-500 px-3 py-1 hover:bg-gray-200 hover:text-purple-800 rounded-full font-bold text-left"
                >
                  LogOut
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
