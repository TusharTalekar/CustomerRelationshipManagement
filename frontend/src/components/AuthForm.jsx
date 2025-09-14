import React from "react";

const AuthForm = ({ isRegistering, setIsRegistering, handleAuthSubmit }) => {
  return (
    <div className="card w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isRegistering ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {isRegistering && (
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
              required
            />
          </div>
        )}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-base"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 rounded-lg font-semibold text-white bg-violet-700 hover:bg-violet-800 transition-colors"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-sm text-violet-600 hover:underline"
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
