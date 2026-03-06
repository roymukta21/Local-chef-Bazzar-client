import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { IoHome } from "react-icons/io5";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { AuthContext } from "../Context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ================= THEME ================= */
  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f54a00",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth)
          .then(() => {
            navigate("/");
            Swal.fire("Logged Out!", "You are logged out.", "success");
          })
          .catch((err) => console.log(err));
      }
    });
  };

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= ACTIVE LINK ================= */

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  /* ================= MENU ================= */

  const menuItems = [
    { name: "Home", path: "/", icon: IoHome },
    { name: "Meals", path: "/meals" },
    { name: "AboutUs", path: "/aboutUs" },
    ...(user
      ? [
          { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { name: "Favorites", path: "/dashboard/favorites" },
        ]
      : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <div className="w-11/12 mx-auto">

        <div className="flex items-center justify-between h-16 md:h-20">

          {/* LOGO */}

          <Link to="/" className="flex items-center">
            <img src="/localChefBazaar.png" className="w-8" alt="logo" />
            <span className="text-lg font-bold text-primary">
              LocalChefBazaar
            </span>
          </Link>

          {/* DESKTOP MENU */}

          <div className="hidden md:flex gap-8">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1 font-medium transition ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary dark:text-gray-300"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {/* THEME TOGGLE */}

            <input
              type="checkbox"
              className="toggle"
              onChange={(e) => handleTheme(e.target.checked)}
              defaultChecked={theme === "dark"}
            />

            {/* USER */}

            {user ? (
              <div ref={dropdownRef} className="relative">

                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="cursor-pointer"
                >
                  <img
                    src={user.photoURL}
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow">

                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 hover:bg-orange-50 dark:hover:bg-gray-700"
                    >
                      <UserCircle className="w-5 h-5 mr-2" />
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-orange-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">

                <Link
                  to="/login"
                  className="border border-primary text-primary px-4 py-2 rounded"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  Register
                </Link>
              </div>
            )}

            {/* MOBILE BUTTON */}

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">

            <div className="flex flex-col gap-3">

              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded ${
                    isActive(item.path)
                      ? "bg-orange-50 text-primary"
                      : "hover:bg-slate-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2 px-4">

                  <Link
                    to="/login"
                    className="bg-primary text-white px-4 py-2 rounded"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="border border-primary text-primary px-4 py-2 rounded"
                  >
                    Signup
                  </Link>

                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;