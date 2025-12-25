import IntakeLog from "../models/IntakeLog.model.js";
import Medicine from "../models/Medicine.model.js";
import User from "../models/User.model.js";
import { sendMail } from "../config/mail.js";
import schedule from "../models/Schedule.model.js";


export const markIntake = async (req, res) => {
  try {
    const { medicineId, date, time, status } = req.body;

    if (!medicineId || !date || !time || !status)
      return res.status(400).json({ message: "All fields are required" });

    if (!["TAKEN", "MISSED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const medicine = await Medicine.findOne({
      _id: medicineId,
      userId: req.user._id
    });

    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    // prevent duplicate log for same medicine + time + date
    const exists = await IntakeLog.findOne({
      userId: req.user._id,
      medicineId,
      date,
      time
    });

    if (exists)
      return res.status(409).json({ message: "Already marked" });

    const log = await IntakeLog.create({
      userId: req.user._id,
      medicineId,
      date,
      time,
      status
    });

    // 🔔 EMAIL NOTIFICATION LOGIC
    const user = await User.findById(req.user._id).select(
      "name guardianEmail notifyGuardian"
    );

    if (user?.guardianEmail && user.notifyGuardian) {
      if (status === "TAKEN") {
        await sendMail({
          to: user.guardianEmail,
          subject: "Medicine Taken Alert",
          html: `
            <h3>Medicine Intake Notification</h3>
            <p><strong>${user.name}</strong> has taken their medicine.</p>
            <p><strong>Medicine:</strong> ${medicine.name}</p>
            <p><strong>Dosage:</strong> ${medicine.dosage}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <hr/>
            <small>Medicine Reminder System</small>
          `
        });
      }

      
      if (status === "MISSED") {
        await sendMail({
          to: user.guardianEmail,
          subject: "Medicine Missed Alert",
          html: `
            <h3>Missed Dose Alert</h3>
            <p><strong>${user.name}</strong> missed a scheduled medicine.</p>
            <p><strong>Medicine:</strong> ${medicine.name}</p>
            <p><strong>Time:</strong> ${time}</p>
          `
        });
      }
      
    }

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/**
 * GET TODAY'S INTAKE LOG
 */
export const getTodayIntake = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const logs = await IntakeLog.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    }).populate("medicineId", "name dosage");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET FULL INTAKE HISTORY
 */
export const getIntakeHistory = async (req, res) => {
  try {
    const logs = await IntakeLog.find({
      userId: req.user._id
    })
      .sort({ date: -1 })
      .populate("medicineId", "name dosage");

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMonthlyIntakeHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    const now = new Date();
    const selectedMonth = month ? month - 1 : now.getMonth();
    const selectedYear = year || now.getFullYear();

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);

    // 1️⃣ Get all medicines
    const medicines = await Medicine.find({ userId });

    // 2️⃣ Get all schedules
    const schedules = await schedule.find({ userId });

    // 3️⃣ Get intake logs for month
    const logs = await IntakeLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).populate("medicineId", "name dosage");

    // 4️⃣ Build medicine-wise history
    const history = medicines.map((medicine) => {
      const medicineSchedules = schedules.filter(
        (s) => String(s.medicineId) === String(medicine._id)
      );

      const medicineLogs = logs.filter(
        (l) => String(l.medicineId._id) === String(medicine._id)
      );

      return {
        medicineId: medicine._id,
        name: medicine.name,
        dosage: medicine.dosage,
        instructions: medicine.instructions,
        schedules: medicineSchedules.map((s) => ({
          times: s.times,
          frequency: s.frequency,
          days: s.days
        })),
        logs: medicineLogs.map((l) => ({
          date: l.date,
          time: l.time,
          status: l.status
        }))
      };
    });

    res.json({
      month: selectedMonth + 1,
      year: selectedYear,
      totalMedicines: medicines.length,
      history
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
