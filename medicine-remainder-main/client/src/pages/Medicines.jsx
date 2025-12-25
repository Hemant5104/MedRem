import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import AddMedicineModal from "../components/AddMedicineModal";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiTrash2,
  FiEdit3,
  FiX,
  FiClock,
  FiPackage,
  FiInfo
} from "react-icons/fi";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editMedicine, setEditMedicine] = useState(null);

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data);
    } catch {
      toast.error("Failed to load medicines");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      toast.success("Medicine deleted");
      fetchMedicines();
    } catch {
      toast.error("Failed to delete medicine");
    }
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Medicines">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              💊 My Medicines
              <span className="ml-3 text-sm bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">
                {medicines.length}
              </span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Click a medicine to view full details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicine..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  pl-9 pr-3 py-2 rounded-xl bg-white/5
                  border border-white/10 text-sm text-white
                  placeholder-gray-400 focus:outline-none focus:border-teal-500
                "
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="
                px-5 py-2 rounded-xl
                bg-gradient-to-r from-teal-500 to-indigo-500
                text-black font-medium hover:scale-105 transition
              "
            >
              + Add Medicine
            </button>
          </div>
        </div>

        {/* MEDICINE LIST */}
        <div className="grid gap-4">
          {filteredMedicines.length === 0 && (
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 text-center text-gray-400">
              No medicines found
            </div>
          )}

          {filteredMedicines.map((m) => (
            <div
              key={m._id}
              onClick={() => setSelectedMedicine(m)}
              className="
                cursor-pointer
                flex flex-col md:flex-row md:items-center md:justify-between gap-4
                bg-white/5 backdrop-blur border border-white/10
                rounded-2xl p-5 hover:border-teal-500/40 transition
              "
            >
              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-xl">
                  💊
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  <p className="text-sm text-gray-400">
                    {m.dosage || "—"} • Qty {m.quantityPerDose || "—"}
                  </p>
                  {m.instructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      {m.instructions}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  Active
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditMedicine(m);
                    setShowModal(true);
                  }}
                   className="p-2 rounded-lg border border-white/20 hover:bg-white/10"
                  >
                  <FiEdit3 />
                </button>

                  

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(m._id);
                  }}
                  className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
                      <AddMedicineModal
                      onClose={() => {
                        setShowModal(false);
                        setEditMedicine(null);
                      }}
                    onSuccess={fetchMedicines}
                   editData={editMedicine}
                  />
          )}


        {/* DETAILS MODAL */}
        {selectedMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
            <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-2xl p-6 relative">

              <button
                onClick={() => setSelectedMedicine(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-2xl">
                  💊
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedMedicine.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {selectedMedicine.dosage || "No dosage info"}
                  </p>
                </div>
              </div>

              <Detail label="Quantity per dose" value={selectedMedicine.quantityPerDose} icon={<FiPackage />} />
              <Detail label="Frequency" value={selectedMedicine.frequency || "As prescribed"} icon={<FiClock />} />
              <Detail label="Instructions" value={selectedMedicine.instructions || "None"} icon={<FiInfo />} />
              <Detail label="Status" value={<span className="text-green-400">Active</span>} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const Detail = ({ label, value, icon }) => (
  <div className="flex gap-3 mb-4 text-sm">
    {icon && <span className="text-teal-400 mt-0.5">{icon}</span>}
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p>{value || "—"}</p>
    </div>
  </div>
);

export default Medicines;