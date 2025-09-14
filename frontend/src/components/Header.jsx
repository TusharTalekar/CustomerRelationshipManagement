import React from "react";

const Header = ({ isLoggedIn, handleLogout, user }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <h1 className="text-3xl flex gap-3 items-center font-bold text-violet-700"><img src="favicon.ico" alt="" />SnapCRM</h1>
        <nav className="space-x-4 flex items-center">
          {isLoggedIn && user && (
            <span className="text-gray-600 font-medium">Welcome, {user.name}!</span>
          )}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
