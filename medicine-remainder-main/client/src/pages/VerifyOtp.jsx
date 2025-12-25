import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from register page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Email not found. Please register again.</p>
      </div>
    );
  }

  // ------------------------
  // VERIFY OTP
  // ------------------------
  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      return setError("Enter valid 6-digit OTP");
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/verify-email", {
        email,
        otp
      });

      // backend should return token after verification
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // RESEND OTP
  // ------------------------
  const handleResend = async () => {
    try {
      setResendLoading(true);
      setError("");

      await api.post("/auth/resend-otp/register", { email });

      alert("OTP resent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xl">
            🔐
          </div>
          <h2 className="text-2xl font-semibold">Verify OTP</h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit OTP sent to
          </p>
          <p className="text-sm font-medium text-gray-700">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            className="w-full text-center tracking-widest text-lg px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-teal-600 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Wrong email?{" "}
          <Link to="/register" className="text-teal-600 font-medium">
            Register again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
