import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiKey, FiRefreshCw } from "react-icons/fi";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  // resend otp timer
  const [timer, setTimer] = useState(0);

  // countdown effect
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // STEP 1 → Send OTP
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email");
      setStep(2);
      setTimer(10); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP resent successfully");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 → Reset password
  const handleResetPassword = async () => {
    if (!otp || !password) {
      toast.error("OTP and new password required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password
      });
      toast.success("Password reset successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">

        {/* HEADER */}
        <h2 className="text-2xl font-bold mb-2">🔐 Forgot Password</h2>
        <p className="text-sm text-gray-400 mb-6">
          {step === 1
            ? "Enter your email to receive OTP"
            : "Enter OTP and create new password"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              icon={<FiMail />}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />

            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-semibold hover:scale-105 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              icon={<FiKey />}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Input
              icon={<FiLock />}
              placeholder="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* RESEND OTP */}
            <button
              onClick={handleResendOTP}
              disabled={timer > 0 || loading}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-white/20 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50"
            >
              <FiRefreshCw />
              {timer > 0
                ? `Resend OTP in ${timer}s`
                : "Resend OTP"}
            </button>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-semibold hover:scale-105 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
          <a href="/login" className="text-teal-400 hover:underline">
            Login
          </a>
        </div>

      </div>
    </div>
  );
};

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400">
      {icon}
    </span>
    <input
      {...props}
      className="
        w-full pl-10 pr-3 py-3 rounded-xl
        bg-white/5 border border-white/10
        text-sm placeholder-gray-400
        focus:outline-none focus:border-teal-500
      "
    />
  </div>
);

export default ForgotPassword;
