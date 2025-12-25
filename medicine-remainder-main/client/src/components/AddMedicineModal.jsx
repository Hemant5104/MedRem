import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiX, FiClock, FiPlus } from "react-icons/fi";

const AddMedicineModal = ({ onClose, onSuccess, editData }) => {
  const isEdit = Boolean(editData);

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    quantityPerDose: "",
    instructions: ""
  });

  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        dosage: editData.dosage || "",
        quantityPerDose: editData.quantityPerDose || "",
        instructions: editData.instructions || ""
      });
      api.get(`/schedules?medicineId=${editData._id}`).then((res) => {
        if (res.data?.length > 0) {
          setTimes(res.data[0].times || []);
        }
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addTime = () => {
    if (!timeInput || times.includes(timeInput)) return;
    setTimes([...times, timeInput]);
    setTimeInput("");
  };

  const removeTime = (time) => {
    setTimes(times.filter((t) => t !== time));
  };

  // ✅ ADD OR UPDATE MEDICINE
  const handleSubmit = async () => {
    if (!form.name || times.length === 0) {
      toast.error("Medicine name and at least one time required");
      return;
    }

    try {
      let medicineId = editData?._id;

      // 🆕 ADD
      if (!isEdit) {
        const res = await api.post("/medicines", {
          ...form,
          startDate: new Date()
        });
        medicineId = res.data._id;
      }

      // ✏️ UPDATE
      if (isEdit) {
        await api.put(`/medicines/${medicineId}`, form);
      }

      // ⏰ UPDATE / CREATE SCHEDULE
      const schRes = await api.get(`/schedules?medicineId=${medicineId}`);

      if (schRes.data.length > 0) {
        await api.put(`/schedules/${schRes.data[0]._id}`, {
          times,
          frequency: "DAILY"
        });
      } else {
        await api.post("/schedules", {
          medicineId,
          times,
          frequency: "DAILY"
        });
      }

      toast.success(isEdit ? "Medicine updated" : "Medicine added");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-2xl p-6 text-white relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-1">
          💊 {isEdit ? "Edit Medicine" : "Add Medicine"}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {isEdit ? "Update medicine details" : "Add medicine and schedule"}
        </p>

        <div className="space-y-4">
          <Input label="Medicine Name" name="name" value={form.name} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} />
            <Input
              label="Quantity"
              name="quantityPerDose"
              type="number"
              value={form.quantityPerDose}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Instructions</label>
            <select
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
            >
              <option value="">Select</option>
              <option value="Before food">Before food</option>
              <option value="After food">After food</option>
              <option value="With food">With food</option>
            </select>
          </div>

          {/* TIMES */}
          <div>
            <label className="text-sm text-gray-400">Medicine Times</label>
            <div className="flex gap-2 mt-1">
              <input
                type="time"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2"
              />
              <button onClick={addTime} className="px-4 rounded-xl bg-teal-500 text-black">
                <FiPlus />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {times.map((t) => (
                <span key={t} className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400">
                  <FiClock /> {t}
                  <button onClick={() => removeTime(t)}>✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-white/20 rounded-xl">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black">
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      {...props}
      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2"
    />
  </div>
);

export default AddMedicineModal;
