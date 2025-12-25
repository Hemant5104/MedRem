import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FiClock,
  FiTrendingUp,
  FiActivity,
  FiPlus,
  FiFileText,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      const [medRes, schRes, logRes, histRes] = await Promise.all([
        api.get("/medicines"),
        api.get("/schedules"),
        api.get("/intake/today"),
        api.get("/intake/history")
      ]);
      setMedicines(medRes.data);
      setSchedules(schRes.data);
      setTodayLogs(logRes.data);
      setHistoryLogs(histRes.data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- REFRESH LOGS ----------------
  const refreshLogs = async () => {
    try {
      const [todayRes, histRes] = await Promise.all([
        api.get("/intake/today"),
        api.get("/intake/history")
      ]);
      setTodayLogs(todayRes.data);
      setHistoryLogs(histRes.data);
    } catch {}
  };

  useEffect(() => {
    const id = setInterval(refreshLogs, 60000);
    return () => clearInterval(id);
  }, []);

  // ---------------- MARK STATUS (TAKEN / MISSED) ----------------
  const markStatus = async (medicineId, time, status) => {
    const key = `${medicineId}-${time}-${status}`;
    try {
      setLoadingAction(key);

      await api.post("/intake/mark", {
        medicineId,
        date: new Date(),
        time,
        status
      });

      await refreshLogs();
      toast.success(
        status === "TAKEN" ? "Medicine taken" : "Medicine skipped"
      );
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingAction(null);
    }
  };

  // ---------------- TODAY TIMELINE ----------------
  const todayTimeline = schedules
    .flatMap((s) =>
      (s?.times || []).map((time) => {
        const medId =
          typeof s.medicineId === "string"
            ? s.medicineId
            : s.medicineId?._id;

        const med = medicines.find((m) => m._id === medId);

        const log = todayLogs.find((l) => {
          const logMedId =
            typeof l.medicineId === "string"
              ? l.medicineId
              : l.medicineId?._id;
          return logMedId === medId && l.time === time;
        });

        return {
          time,
          medicine: med,
          status: log?.status || "UPCOMING"
        };
      })
    )
    .filter((i) => i.medicine)
    .sort((a, b) => a.time.localeCompare(b.time));

  const skippedToday = todayTimeline.filter(
    (i) => i.status === "MISSED"
  );

  // ---------------- NEXT DOSE ----------------
  const nextDose = useMemo(() => {
    const now = new Date();
    const current = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
    const today = now.toLocaleString("en-US", { weekday: "short" });

    const validSchedules = schedules.filter((s) => {
      const medId =
        typeof s.medicineId === "string"
          ? s.medicineId
          : s.medicineId?._id;
      const hasMed = medicines.some((m) => m._id === medId);
      const dayOk =
        s.frequency === "CUSTOM" ? (s.days || []).includes(today) : true;
      return hasMed && dayOk;
    });

    const times = validSchedules.flatMap((s) => s?.times || []).sort();
    const upcoming = times.find((t) => t >= current);
    return upcoming || times[0] || "—";
  }, [schedules, medicines]);

  // ---------------- GRAPH DATA ----------------
  const adherenceData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Object.fromEntries(days.map((d) => [d, 0]));

    historyLogs.forEach((log) => {
      const day = new Date(log.date).toLocaleString("en-US", {
        weekday: "short"
      });
      if (log.status === "TAKEN") counts[day] += 1;
    });

    return days.map((day) => ({ day, taken: counts[day] }));
  }, [historyLogs]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Suresh 👋</h1>
          <p className="text-sm text-gray-400">
            Your medicine & health overview
          </p>
        </div>

        {/* WARNING */}
        {skippedToday.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <FiAlertTriangle className="text-red-400 text-xl" />
            <p className="text-sm text-red-300">
              You skipped {skippedToday.length} medicine(s) today.
              Please retake if possible.
            </p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<FiActivity />} label="Today Doses" value={todayTimeline.length} />
          <StatCard icon={<FiTrendingUp />} label="Streak" value="14 Days" />
          <StatCard icon={<FiClock />} label="Next Dose" value={nextDose} />
          <StatCard icon={<FiFileText />} label="Reports" value="View" />
        </div>

        {/* TODAY MEDICINES */}
        <Section title="💊 Today’s Medicines">
          {todayTimeline.map((item, idx) => (
            <MedicineRow
              key={idx}
              item={item}
              loadingAction={loadingAction}
              onTake={() =>
                markStatus(item.medicine._id, item.time, "TAKEN")
              }
              onSkip={() =>
                markStatus(item.medicine._id, item.time, "MISSED")
              }
            />
          ))}
        </Section>

        {/* SKIPPED MEDICINES */}
        {skippedToday.length > 0 && (
          <Section title="⚠️ Skipped Medicines">
            {skippedToday.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-red-500/30 bg-red-500/5"
              >
                <div>
                  <p className="text-sm text-red-400">{item.time}</p>
                  <p className="font-semibold">{item.medicine.name}</p>
                </div>

                <button
                  onClick={() =>
                    markStatus(item.medicine._id, item.time, "TAKEN")
                  }
                  disabled={loadingAction}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-teal-500 text-black"
                >
                  {loadingAction ===
                  `${item.medicine._id}-${item.time}-TAKEN`
                    ? "..."
                    : (
                      <>
                        <FiRefreshCw /> Retake
                      </>
                    )}
                </button>
              </div>
            ))}
          </Section>
        )}

        {/* GRAPH */}
        <Section title="📊 Weekly Adherence">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adherenceData}>
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="taken"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Section>

        {/* ACTION */}
        <div className="flex gap-4">
          <ActionButton
            icon={<FiPlus />}
            text="Add Medicine"
            onClick={() => navigate("/medicines")}
          />
        </div>

      </div>
    </DashboardLayout>
  );
};

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
    <h3 className="text-sm text-gray-400">{title}</h3>
    {children}
  </div>
);

const MedicineRow = ({ item, onTake, onSkip, loadingAction }) => (
  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10">
    <div>
      <p className="text-sm text-teal-400">{item.time}</p>
      <p className="font-semibold">{item.medicine.name}</p>
      <p className="text-xs text-gray-400">
        {item.medicine.dosage} • {item.medicine.instructions}
      </p>
    </div>

    <div className="flex gap-2">
      <button
        disabled={item.status === "TAKEN" || loadingAction}
        onClick={onTake}
        className={`px-4 py-1.5 rounded-lg ${
          item.status === "TAKEN"
            ? "bg-white/10 text-gray-300"
            : "bg-teal-500 text-black"
        }`}
      >
        {loadingAction ===
        `${item.medicine._id}-${item.time}-TAKEN`
          ? "..."
          : item.status === "TAKEN"
          ? "Taken"
          : "Take"}
      </button>

      {item.status !== "TAKEN" && (
        <button
          disabled={loadingAction}
          onClick={onSkip}
          className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400"
        >
          {loadingAction ===
          `${item.medicine._id}-${item.time}-MISSED`
            ? "..."
            : "Skip"}
        </button>
      )}
    </div>
  </div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <div className="text-teal-400 text-xl mb-2">{icon}</div>
    <p className="text-sm text-gray-400">{label}</p>
    <h2 className="text-xl font-bold">{value}</h2>
  </div>
);

const ActionButton = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-medium"
  >
    {icon}
    {text}
  </button>
);

export default Dashboard;
