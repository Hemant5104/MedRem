import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import HospitalsDirectory from "./pages/HospitalsDirectory";
import Appointments from "./pages/Appoiments";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import History from "./pages/History";
import Profile from "./pages/Profile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/hospitals" element={<HospitalsDirectory />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/history" element={<History />} />
      <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
