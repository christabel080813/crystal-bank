import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
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

    setMessage("");
    setError("");
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!nameRegex.test(formData.full_name)) {
      setError("Full name can only contain letters and spaces.");
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      setError("Phone number can only contain numbers.");
      return;
    }

    if (formData.phone.length < 10 || formData.phone.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and contain a letter and a number."
      );
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
            Create your account
          </h2>

          <p className="text-gray-400 mt-2">
            Join Crystal Bank and start managing your money.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-5"
        >

          <div>
            <label className="block text-sm mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

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
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
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
              placeholder="Create a password"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-500 text-sm">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-900 py-3 rounded-lg font-medium"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-400"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;



// function Register() {
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-12">

//       <div className="w-full max-w-md">

//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold">
//             CRYSTAL<span className="text-red-600">Bank</span>
//           </h1>

//           <h2 className="text-2xl font-semibold mt-6">
//             Create your account
//           </h2>

//           <p className="text-gray-400 mt-2">
//             Join CRYSTAL and start managing your money.
//           </p>
//         </div>

//         <form className="bg-[#111111] border border-gray-800 rounded-2xl p-6 space-y-5">

//           <div>
//             <label className="block text-sm mb-2">
//               Full Name
//             </label>

//             <input
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-2">
//               Email
//             </label>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-2">
//               Phone Number
//             </label>

//             <input
//               type="tel"
//               placeholder="Enter your phone number"
//               className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-2">
//               Password
//             </label>

//             <input
//               type="password"
//               placeholder="Create a password"
//               className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
//             />
//           </div>

//           <div>
//             <label className="block text-sm mb-2">
//               Confirm Password
//             </label>

//             <input
//               type="password"
//               placeholder="Confirm your password"
//               className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium"
//           >
//             Create Account
//           </button>

//         </form>

//         <p className="text-center text-gray-400 mt-6">
//           Already have an account?{" "}
//           <a href="/login" className="text-red-500 hover:text-red-400">
//             Login
//           </a>
//         </p>

//       </div>
//     </div>
//   );
// }

// export default Register;