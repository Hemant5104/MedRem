import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";

const History = () => {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/intake/history/month?month=${month}&year=${year}`
      );
      setData(res.data.history || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [month, year]);

  return (
    <DashboardLayout title="History">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">📜 Medicine History</h1>
          <p className="text-sm text-gray-400">
            Track your monthly medicine intake
          </p>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
            <FiCalendar />
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-transparent outline-none"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i + 1} className="text-black">
                  {new Date(0, i).toLocaleString("en", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent outline-none"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <option
                  key={i}
                  value={now.getFullYear() - i}
                  className="text-black"
                >
                  {now.getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-400">Loading history...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-400">No records found</p>
        ) : (
          <div className="space-y-6">
            {data.map((med) => (
              <div
                key={med.medicineId}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                {/* MEDICINE HEADER */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{med.name}</h2>
                  <p className="text-sm text-gray-400">
                    {med.dosage} • {med.instructions}
                  </p>
                </div>

                {/* SCHEDULE */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Schedule</p>
                  <div className="flex flex-wrap gap-2">
                    {med.schedules.map((s, i) =>
                      s.times.map((t) => (
                        <span
                          key={`${i}-${t}`}
                          className="px-3 py-1 text-xs rounded-full bg-teal-500/20 text-teal-300"
                        >
                          {t}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* LOGS */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Intake Logs</p>

                  {med.logs.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No intake recorded
                    </p>
                  ) : (
                    med.logs.map((log, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/5"
                      >
                        <div>
                          <p className="text-sm">
                            {new Date(log.date).toDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {log.time}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-2 text-sm ${
                            log.status === "TAKEN"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {log.status === "TAKEN" ? (
                            <FiCheckCircle />
                          ) : (
                            <FiXCircle />
                          )}
                          {log.status}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;
