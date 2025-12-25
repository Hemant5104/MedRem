import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const HOSPITAL_DATA = {

  Punjab: [
    { name: "PGIMER Chandigarh", phone: "0172-2747585" },
    { name: "Fortis Hospital Mohali", phone: "0172-4692222" },
    { name: "Max Super Specialty Hospital Mohali", phone: "0172-5212000" },
    { name: "Ivy Hospital Mohali", phone: "0172-7170000" },
    { name: "Silver Oaks Hospital Mohali", phone: "0172-5090909" },

    { name: "Dayanand Medical College, Ludhiana", phone: "0161-4684100" },
    { name: "Fortis Hospital Ludhiana", phone: "0161-5133333" },
    { name: "Christian Medical College Ludhiana", phone: "0161-5010800" },

    { name: "Amandeep Hospital Amritsar", phone: "0183-5060400" },
    { name: "Guru Nanak Dev Hospital Amritsar", phone: "0183-2258800" },
    { name: "Fortis Escorts Hospital Amritsar", phone: "0183-3012222" },

    { name: "Civil Hospital Jalandhar", phone: "0181-2224417" },
    { name: "Johal Hospital Jalandhar", phone: "0181-2450400" },

    { name: "Civil Hospital Patiala", phone: "0175-2212055" },
    { name: "Columbia Asia Hospital Patiala", phone: "0175-5000666" },

    { name: "Adesh Hospital Bathinda", phone: "0164-2430000" },
    { name: "Civil Hospital Bathinda", phone: "0164-2211600" },

    { name: "Tagore Hospital Jalandhar", phone: "0181-4680800" },
    { name: "Sacred Heart Hospital Jalandhar", phone: "0181-2670664" },
    { name: "Healing Hospital Chandigarh", phone: "0172-5212222" }
  ],

  // =========================
  // KARNATAKA
  // =========================
  Karnataka: [
    { name: "Apollo Hospital Bangalore", phone: "080-46124444" },
    { name: "Fortis Hospital Bannerghatta", phone: "080-66214444" },
    { name: "Manipal Hospital Old Airport Road", phone: "080-25024444" },
    { name: "NIMHANS Bangalore", phone: "080-26995000" },
    { name: "Victoria Hospital Bangalore", phone: "080-26701150" },
    { name: "KMC Hospital Manipal", phone: "0820-2922000" },
    { name: "AJ Hospital Mangaluru", phone: "0824-6618888" },
    { name: "JSS Hospital Mysuru", phone: "0821-2335555" }
  ],

  // =========================
  // MAHARASHTRA
  // =========================
  Maharashtra: [
    { name: "Tata Memorial Hospital Mumbai", phone: "022-24177000" },
    { name: "Kokilaben Hospital Mumbai", phone: "022-42696969" },
    { name: "Lilavati Hospital Mumbai", phone: "022-26568000" },
    { name: "Jaslok Hospital Mumbai", phone: "022-66573000" },
    { name: "Ruby Hall Clinic Pune", phone: "020-26163391" },
    { name: "Sahyadri Hospital Pune", phone: "020-67213000" },
    { name: "AIIMS Nagpur", phone: "0712-2801200" }
  ],

  // =========================
  // DELHI
  // =========================
  Delhi: [
    { name: "AIIMS Delhi", phone: "011-26588500" },
    { name: "Safdarjung Hospital", phone: "011-26165060" },
    { name: "Fortis Escorts Heart Institute", phone: "011-47135000" },
    { name: "Max Hospital Saket", phone: "011-26515050" },
    { name: "Sir Ganga Ram Hospital", phone: "011-42254000" }
  ],

  // =========================
  // HARYANA
  // =========================
  Haryana: [
    { name: "Medanta – The Medicity Gurugram", phone: "0124-4141414" },
    { name: "Artemis Hospital Gurugram", phone: "0124-4511111" },
    { name: "Civil Hospital Gurugram", phone: "0124-2321111" },
    { name: "Alchemist Hospital Panchkula", phone: "0172-5007777" }
  ],

  // =========================
  // RAJASTHAN
  // =========================
  Rajasthan: [
    { name: "SMS Hospital Jaipur", phone: "0141-2560291" },
    { name: "Fortis Hospital Jaipur", phone: "0141-4097100" },
    { name: "EHCC Hospital Jaipur", phone: "0141-7100100" },
    { name: "AIIMS Jodhpur", phone: "0291-2740741" }
  ]
};


const HospitalsDirectory = () => {
  const [search, setSearch] = useState("");

  const filteredDistricts = Object.entries(HOSPITAL_DATA).filter(
    ([district]) =>
      district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Hospitals Directory">
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white p-6 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">
            🏥 Hospital Directory
          </h1>
          <p className="text-sm text-gray-400">
            Search district to find hospital contact numbers
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search district (e.g. Mysuru)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/5 border border-white/10
              text-sm text-white placeholder-gray-400
              focus:outline-none focus:border-teal-500
            "
          />
        </div>

        {/* DISTRICT RESULTS */}
        <div className="space-y-6">
          {filteredDistricts.length === 0 && (
            <div className="text-gray-400 text-sm">
              No district found
            </div>
          )}

          {filteredDistricts.map(([district, hospitals]) => (
            <div
              key={district}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
            >
              {/* DISTRICT NAME */}
              <h2 className="text-lg font-semibold text-teal-400 mb-4">
                {district}
              </h2>

              {/* HOSPITAL LIST */}
              <div className="space-y-3">
                {hospitals.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:border-teal-500/40 transition"
                  >
                    <div>
                      <p className="font-medium">
                        {h.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        📞 {h.phone}
                      </p>
                    </div>

                    <a
                      href={`tel:${h.phone}`}
                      className="px-4 py-1.5 rounded-lg bg-teal-500 text-black text-sm font-medium hover:scale-105 transition"
                    >
                      Call
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center">
          * Static demo data for reference only
        </p>
      </div>
    </DashboardLayout>
  );
};

export default HospitalsDirectory;
