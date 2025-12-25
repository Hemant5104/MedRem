import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950 text-white">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="text-2xl font-bold tracking-wide">
          Med<span className="text-teal-400">Rem</span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm text-gray-300">
          <a className="hover:text-white" href="#">Medicines</a>
          <a className="hover:text-white" href="#">Appointments</a>
          <a className="hover:text-white" href="#">Hospitals</a>
          <a className="hover:text-white" href="#">Family Care</a>
        </nav>

        <a
          href="/register"
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-semibold hover:scale-105 transition"
        >
          Get Started
        </a>
      </header>

      {/* HERO */}
      <section className="px-8 md:px-16 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Never Miss Your Medicine. <br />
            <span className="text-teal-400">Your Health, On Time.</span>
          </h1>

          <p className="text-gray-400 mt-6 text-lg">
            Millions in India miss daily medicines due to busy schedules,
            forgetfulness, or lack of reminders.  
            <span className="text-white font-medium">
              MedRem solves this.
            </span>
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="/register"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-semibold hover:scale-105 transition"
            >
              Start Free
            </a>

            <a
              href="/login"
              className="px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition"
            >
              Login
            </a>
          </div>

          <p className="mt-6 italic text-sm text-gray-500">
            “Always laugh when you can, it is cheap medicine.” — Lord Byron
          </p>
        </div>

        {/* HERO CARD */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-teal-400">
            📊 Real Problem in India
          </h3>

          <div className="space-y-3">
            <StatBar label="People forget daily medicines" value="65%" />
            <StatBar label="Elderly patients miss doses" value="48%" />
            <StatBar label="Chronic patients irregular" value="54%" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-8 md:px-16 py-20 space-y-12">

        <h2 className="text-3xl font-bold text-center">
          Why MedRem?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="⏰ Smart Reminders"
            desc="Timely notifications so you never miss a dose."
          />
          <Feature
            title="🩺 Doctor Appointments"
            desc="Track doctor visits, reports & locations easily."
          />
          <Feature
            title="🏥 Hospital Directory"
            desc="Quick access to hospital contacts by district."
          />
        </div>
      </section>

      {/* HOSPITAL HELPLINES */}
      <section className="px-8 md:px-16 py-20 bg-white/5">
        <h2 className="text-3xl font-bold text-center mb-10">
          Emergency Hospital Contacts
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <HospitalCard name="AIIMS Delhi" phone="011-26588500" />
          <HospitalCard name="PGIMER Chandigarh" phone="0172-2747585" />
          <HospitalCard name="NIMHANS Bangalore" phone="080-26995000" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-16 py-20 text-center">
        <h2 className="text-3xl font-bold">
          Take Control of Your Health Today
        </h2>
        <p className="text-gray-400 mt-4">
          Designed for patients, elders, and families across India.
        </p>

        <a
          href="/register"
          className="inline-block mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-black font-semibold hover:scale-105 transition"
        >
          Create Free Account
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MedRem — Smart Medicine Reminder for India
      </footer>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-300">{label}</span>
      <span className="text-teal-400">{value}</span>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full"
        style={{ width: value }}
      />
    </div>
  </div>
);

const Feature = ({ title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-teal-500/40 transition">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const HospitalCard = ({ name, phone }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
    <h3 className="font-semibold">{name}</h3>
    <p className="text-teal-400 mt-2">📞 {phone}</p>
    <a
      href={`tel:${phone}`}
      className="inline-block mt-4 px-4 py-2 rounded-lg bg-teal-500 text-black text-sm font-medium hover:scale-105 transition"
    >
      Call Now
    </a>
  </div>
);

export default LandingPage;
