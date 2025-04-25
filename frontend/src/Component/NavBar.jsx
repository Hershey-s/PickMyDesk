import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { NavLink } from "react-router-dom";

// Mock useNavigate since we don't have react-router-dom in this environment
const useNavigate = () => {
  return (path) => console.log(`Navigating to ${path}`);
};

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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
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
              <NavLink to={"/"}> WorkSpaceHub</NavLink>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-3">
            <Button link={"/new"} name={"Create your workspace"} />
            {!isLoggedIn ? (
              <>
                <Button link={"/login"} name={"Log in"} styles="bg-gray-200" />
                <Button
                  link={"/signup"}
                  name={"Sign up"}
                  styles="bg-gray-200"
                />
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-red-500 px-3 py-1 hover:bg-gray-200 hover:text-purple-800 rounded-full font-bold"
              >
                LogOut
              </button>
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
            <Button link={"/new"} name={"Create your workspace"} />
            {!isLoggedIn ? (
              <>
                <Button link={"/login"} name={"Log in"} styles="bg-gray-200" />
                <Button
                  link={"/signup"}
                  name={"Sign up"}
                  styles="bg-gray-200"
                />
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-red-500 px-3 py-1 hover:bg-gray-200 hover:text-purple-800 rounded-full font-bold text-left"
              >
                LogOut
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
}
