import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Firebase/Provider/AuthProvider";

const Register = () => {
  const { createUser, setUser, updateUser } = useContext(AuthContext);
  const [firstNameError, setFirstNameError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const form = e.target;
    const firstName = form.firstName.value;
    const lastName = form.lastName.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (firstName.length < 4) {
      setFirstNameError("Name should be at least 4 characters");
      return;
    } else {
      setFirstNameError("");
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        updateUser({ displayName: firstName })
          .then(() => {
            setUser({ ...user, displayName: firstName });
            navigate("/");
          })
          .catch((error) => {
            console.error(error);
            setUser(user);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl p-8 sm:p-12 flex flex-col lg:flex-row relative">
        {/* Left Panel (without logo) */}
        <div className="lg:w-1/2 flex rounded-2xl flex-col justify-center items-center p-4 lg:p-8 bg-gradient-to-r from-blue-600 to-indigo-500 text-white lg:rounded-3xl">
          <h2 className="text-2xl text-center font-semibold">Welcome to Registration</h2>
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 lg:pl-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-indigo-600">
              Create Your Account
            </h2>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                {firstNameError && <p className="text-xs text-error">{firstNameError}</p>}
              </div>

              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <input type="checkbox" id="terms" className="mr-2" required />
              <label htmlFor="terms">
                I accept the Terms of Use and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              className="block w-full text-center py-2 px-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 transition"
            >
              Register
            </button>

            <p className="text-sm text-center text-gray-500 mt-4">
              Already a member?{" "}
              <Link to="/auth/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;