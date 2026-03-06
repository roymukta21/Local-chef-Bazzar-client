import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  Star,
  Heart,
  ChefHat,
  Plus,
  Package,
  Users,
  FileText,
  BarChart3,
  LogOut,
  House,
  UserRound,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import { NavLink, Outlet, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLogo from "../../components/DashboardLogo";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const { user, logOut } = useAuth();
  const { role } = useRole();
  const navigate = useNavigate();

  /* ================= THEME ================= */

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  /* ================= MENU ================= */

  const userMenuItems = [
    { path: "/", icon: House, label: "Home" },
    { path: "/dashboard", icon: UserRound, label: "My Profile" },
    { path: "/dashboard/orders", icon: ShoppingBag, label: "My Orders" },
    { path: "/dashboard/reviews", icon: Star, label: "My Reviews" },
    { path: "/dashboard/favorites", icon: Heart, label: "Favorite Meals" },
  ];

  const chefMenuItems = [
    { path: "/", icon: House, label: "Home" },
    { path: "/dashboard", icon: UserRound, label: "My Profile" },
    { path: "/dashboard/my-meals", icon: ChefHat, label: "My Meals" },
    {
      path: "/dashboard/order-requests",
      icon: Package,
      label: "Order Requests",
    },
    { path: "/dashboard/create-meal", icon: Plus, label: "Create Meal" },
  ];

  const adminMenuItems = [
    { path: "/", icon: House, label: "Home" },
    { path: "/dashboard", icon: UserRound, label: "My Profile" },
    { path: "/dashboard/manage-users", icon: Users, label: "Manage Users" },
    {
      path: "/dashboard/manage-requests",
      icon: FileText,
      label: "Manage Requests",
    },
    {
      path: "/dashboard/statistics",
      icon: BarChart3,
      label: "Platform Statistics",
    },
  ];

  const getMenuItems = () => {
    if (role === "chef") return chefMenuItems;
    if (role === "Admin") return adminMenuItems;
    return userMenuItems;
  };

  const menuItems = getMenuItems();

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

          Swal.fire({
            title: "Logged Out!",
            text: "You are logged out.",
            icon: "success",
          });
        })
        .catch((err) => console.log(err));
    }
  });
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}

      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-20">
        <div className="flex items-center justify-between p-4">
          <DashboardLogo />

          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}

          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {role === "chef"
                ? "👨‍🍳 Chef"
                : role === "Admin"
                  ? "🛡️ Admin"
                  : "🍽️ User"}
            </h2>

            <p className="text-sm text-primary font-semibold mt-1">
              {user?.name || "Profile"}
            </p>
          </div>

          {/* Navigation */}

          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/dashboard"}
                      onClick={() => {
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-orange-50 text-primary dark:bg-gray-700"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Section */}

          <div className="p-4 border-t dark:border-gray-700 space-y-4">
            {/* Theme Toggle */}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Dark Mode
              </span>

              <input
                type="checkbox"
                className="toggle"
                onChange={(e) => handleTheme(e.target.checked)}
                defaultChecked={theme === "dark"}
              />
            </div>

            {/* Logout */}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}

      <div className="lg:ml-64 mt-8 lg:mt-0 p-8 min-h-screen">
        <Outlet />
      </div>

      {/* Overlay */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default DashboardLayout;
