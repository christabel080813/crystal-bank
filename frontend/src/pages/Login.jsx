import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError("Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold">
            Crystal<span className="text-red-600">Bank</span>
          </h1>

          <h2 className="text-2xl font-semibold mt-6">
            Welcome Back
          </h2>

          <p className="text-gray-400 mt-2">
            Login to your Crystal Bank account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-5"
        >

          <div>
            <label className="block text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 py-3 rounded-lg font-medium"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-400"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;