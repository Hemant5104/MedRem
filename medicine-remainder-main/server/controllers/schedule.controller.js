import Schedule from "../models/Schedule.model.js";
import Medicine from "../models/Medicine.model.js";

/**
 * ADD SCHEDULE (TIMETABLE)
 */
export const addSchedule = async (req, res) => {
  try {
    const { medicineId, times, frequency, days } = req.body;

    if (!medicineId || !times || times.length === 0)
      return res.status(400).json({ message: "Required fields missing" });

    const medicine = await Medicine.findOne({
      _id: medicineId,
      userId: req.user._id
    });

    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    const schedule = await Schedule.create({
      userId: req.user._id,
      medicineId,
      times,
      frequency,
      days
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER SCHEDULES
 */
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user._id })
      .populate("medicineId", "name dosage");

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SCHEDULE
 */
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE SCHEDULE
 */
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
