import React from "react";
import { Link } from "react-router";

const DashboardLogo = () => {
  return (
    <div className="">
      <Link to="/" className="flex items-center">
            <img src="/localChefBazaar.png" className="w-8" alt="logo" />
            <span className="text-lg font-bold text-primary">
              LocalChefBazaar
            </span>
          </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
      
    </div>
  );
};

export default DashboardLogo;
