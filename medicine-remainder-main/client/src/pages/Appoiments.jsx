import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiTrash2,
  FiUpload
} from "react-icons/fi";

const STORAGE_KEY = "doctor_appointments";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    time: "",
    location: "",
    notes: "",
    report: null
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setAppointments(stored);
  }, []);

  const saveAppointments = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAppointments(data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 📍 Get live location
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          location: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`
        }));
      },
      () => toast.error("Unable to fetch location")
    );
  };

  // 📄 Upload report (image)
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, report: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!form.doctor || !form.date || !form.time || !form.location) {
      toast.error("Please fill required fields");
      return;
    }

    const newAppointment = {
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updated = [...appointments, newAppointment];
    saveAppointments(updated);

    toast.success("Appointment added");
    setShowModal(false);
    setForm({
      doctor: "",
      date: "",
      time: "",
      location: "",
      notes: "",
      report: null
    });
  };

  const deleteAppointment = (id) => {
    const updated = appointments.filter((a) => a.id !== id);
    saveAppointments(updated);
    toast.success("Appointment removed");
  };

  return (
    <DashboardLayout title="Appointments">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🩺 Doctor Appointments</h1>
            <p className="text-sm text-gray-400">
              Manage visits, location & reports
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-medium"
          >
            <FiPlus /> Add Appointment
          </button>
        </div>

        {/* LIST */}
        <div className="grid gap-4">
          {appointments.map((a) => (
            <div
              key={a.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between gap-6"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{a.doctor}</h3>

                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                    <FiCalendar /> {a.date}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded">
                    <FiClock /> {a.time}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <FiMapPin /> {a.location}
                </div>

                {a.notes && (
                  <p className="text-sm text-gray-400">📝 {a.notes}</p>
                )}

                {a.report && (
                  <img
                    src={a.report}
                    alt="Report"
                    className="w-32 h-32 object-cover rounded-lg border border-white/10 mt-2"
                  />
                )}
              </div>

              <button
                onClick={() => deleteAppointment(a.id)}
                className="p-2 h-fit rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6">

              <h2 className="text-xl font-semibold mb-4">Add Appointment</h2>

              <div className="space-y-4">
                <Input label="Doctor Name" name="doctor" value={form.doctor} onChange={handleChange} />

                <InputWithIcon icon={<FiCalendar />} type="date" name="date" value={form.date} onChange={handleChange} />
                <InputWithIcon icon={<FiClock />} type="time" name="time" value={form.time} onChange={handleChange} />

                <div>
                  <label className="text-sm text-gray-400">Location</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={fetchLocation}
                      className="px-3 rounded-xl bg-white/10 border border-white/20"
                    >
                      📍
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Upload Report</label>
                  <label className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                    <FiUpload />
                    <span className="text-sm">Choose image</span>
                    <input type="file" accept="image/*" hidden onChange={handleFile} />
                  </label>
                </div>

                <Textarea label="Notes" name="notes" value={form.notes} onChange={handleChange} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-white/20 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-medium"
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      {...props}
      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
    />
  </div>
);

const InputWithIcon = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400">
      {icon}
    </span>
    <input
      {...props}
      className="pl-10 mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
    />
  </div>
);

export default Appointments;
