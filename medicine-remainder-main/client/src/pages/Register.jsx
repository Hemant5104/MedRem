import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    guardianEmail: "",
    password: "",
    confirmPassword: "",
    gender: "",
    height: "",
    weight: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        guardianEmail: form.guardianEmail,
        password: form.password,
        gender: form.gender,
        height: { value: form.height, unit: "cm" },
        weight: { value: form.weight, unit: "kg" }
      });

      alert(res.data.message || "OTP sent to email");

      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xl">
            💊
          </div>
          <h2 className="text-2xl font-semibold">Create Account</h2>
          <p className="text-sm text-gray-500">
            Start your journey to better health
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
              placeholder="enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
          </div>

          {/* Guardian Email */}
          <div>
            <label className="text-sm text-gray-600">
              Guardian Email <span className="text-gray-400">(optional)</span>
            </label>
            <input
              name="guardianEmail"
              type="email"
              placeholder="caregiver@example.com"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              required
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="height"
              type="number"
              placeholder="Height (cm)"
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
            />
            <input
              name="weight"
              type="number"
              placeholder="Weight (kg)"
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={handleChange}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
