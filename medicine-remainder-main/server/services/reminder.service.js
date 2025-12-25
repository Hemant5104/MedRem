import cron from "node-cron";
import Schedule from "../models/Schedule.model.js";
import Medicine from "../models/Medicine.model.js";
import User from "../models/User.model.js";
import { sendMail } from "../config/mail.js";

cron.schedule(
  "* * * * *",
  async () => {
    try {
      console.log(" Reminder job running");

      const now = new Date();

      // Force HH:mm format
      const currentTime = now
        .toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });

      const currentDay = now.toLocaleString("en-US", {
        weekday: "short"
      });

      console.log("Time:", currentTime, " Day:", currentDay);

      // ✅ FIX: use $in for array field
      const schedules = await Schedule.find({
        times: { $in: [currentTime] }
      });

      console.log("Schedules found:", schedules.length);

      for (const schedule of schedules) {
        // CUSTOM day check
        if (
          schedule.frequency === "CUSTOM" &&
          !schedule.days.includes(currentDay)
        ) {
          continue;
        }

        const medicine = await Medicine.findById(schedule.medicineId);
        const user = await User.findById(schedule.userId);

        if (!medicine || !user) continue;

        console.log("Sending reminder for:", medicine.name);

        await sendMail({
          to: user.email,
          subject: "Medicine Reminder",
          html: `
            <h3>Time to take your medicine</h3>
            <p><b>Medicine:</b> ${medicine.name}</p>
            <p><b>Dosage:</b> ${medicine.dosage}</p>
            <p><b>Time:</b> ${currentTime}</p>
          `
        });
      }
    } catch (error) {
      console.error("Reminder Error:", error.message);
    }
  },
  {
    timezone: "Asia/Kolkata" // ⭐ VERY IMPORTANT
  }
);
