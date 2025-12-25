import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCamera,
  FiTrash2,
  FiActivity
} from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    guardianEmail: "",
    notifyGuardian: true,
    bloodGroup: "",
    allergies: "",
    medicalConditions: ""
  });

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const data = res.data;

      setProfile(data);
      setForm({
        name: data?.name || "",
        guardianEmail: data?.guardianEmail || "",
        notifyGuardian: data?.notifyGuardian ?? true,
        bloodGroup: data?.bloodGroup || "",
        allergies: data?.allergies?.join(", ") || "",
        medicalConditions: data?.medicalConditions?.join(", ") || ""
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------- UPDATE PROFILE ----------------
  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/profile", {
        ...form,
        allergies: form.allergies,
        medicalConditions: form.medicalConditions
      });
      toast.success("Profile updated");
      await fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- PROFILE IMAGE (HASHED) ----------------
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        await api.put("/profile/picture", {
          imageBase64: base64,
          imageType: file.type
        });
        toast.success("Profile picture secured");
        fetchProfile();
      } catch {
        toast.error("Image upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = async () => {
    try {
      await api.delete("/profile/picture");
      toast.success("Profile picture removed");
      fetchProfile();
    } catch {
      toast.error("Failed to remove picture");
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="p-6 text-gray-400">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">👤 My Profile</h1>
          <p className="text-sm text-gray-400">
            Manage your personal & health details
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 max-w-3xl">

          {/* PROFILE IMAGE */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-3xl">
              <FiUser />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400">
                Profile picture is stored securely as a hash
              </p>

              <div className="flex gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">
                  <FiCamera /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files[0])
                    }
                  />
                </label>

                {profile?.profileImageHash && (
                  <button
                    onClick={removeImage}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400"
                  >
                    <FiTrash2 /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Full Name" icon={<FiUser />} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />

            <Input label="Email" icon={<FiMail />} value={profile?.email || ""} disabled />

            <Input label="Guardian Email" icon={<FiMail />} value={form.guardianEmail}
              onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })} />

            <div className="flex items-center gap-3 mt-6">
              <FiShield className="text-teal-400" />
              <label className="text-sm">Notify Guardian</label>
              <input
                type="checkbox"
                checked={form.notifyGuardian}
                onChange={(e) =>
                  setForm({ ...form, notifyGuardian: e.target.checked })
                }
                className="ml-auto accent-teal-500"
              />
            </div>
          </div>

          {/* HEALTH INFO (EDITABLE) */}
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-sm text-gray-400 flex items-center gap-2">
              <FiActivity /> Health Information
            </h3>

            <select
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm"
            >
              <option value="">Select Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>

            <Input
              label="Allergies (comma separated)"
              placeholder="Dust, Pollen"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />

            <Input
              label="Medical Conditions (comma separated)"
              placeholder="Diabetes, BP"
              value={form.medicalConditions}
              onChange={(e) =>
                setForm({ ...form, medicalConditions: e.target.value })
              }
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-medium hover:scale-105 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Input = ({ label, icon, ...props }) => (
  <div>
    {label && <label className="text-sm text-gray-400">{label}</label>}
    <div className="mt-1 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
      {icon && <span className="text-teal-400">{icon}</span>}
      <input {...props} className="bg-transparent outline-none flex-1 text-sm" />
    </div>
  </div>
);

export default Profile;
