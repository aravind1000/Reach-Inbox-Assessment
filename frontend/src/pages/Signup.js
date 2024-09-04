import React, { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError("Failed to create an account.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h2 className="text-4xl font-bold mb-8 text-blue-700">Create an Account</h2>
      <form onSubmit={handleSignup} className="bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 mb-6 w-96">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="shadow-lg border border-blue-300 rounded w-full py-4 px-5 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow-lg border border-blue-300 rounded w-full py-4 px-5 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out">
          Sign Up
        </button>
        {error && <p className="text-red-600 text-sm italic mt-2">{error}</p>}
      </form>
      <p className="mt-5 text-gray-700">
        Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
