import Medicine from "../models/Medicine.model.js";
import Schedule from "../models/Schedule.model.js";
import IntakeLog from "../models/IntakeLog.model.js";

export const addMedicine = async (req, res) => {
  try {
    const {
      name,
      type,
      dosage,
      quantityPerDose,
      startDate,
      endDate,
      instructions
    } = req.body;

    if (!name || !startDate)
      return res.status(400).json({ message: "Required fields missing" });

    const medicine = await Medicine.create({
      userId: req.user._id,
      name,
      type,
      dosage,
      quantityPerDose,
      startDate,
      endDate,
      instructions
    });

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    // Cascade delete related schedules and intake logs for this medicine
    await Schedule.deleteMany({ userId: req.user._id, medicineId: req.params.id });
    await IntakeLog.deleteMany({ userId: req.user._id, medicineId: req.params.id });

    res.json({ message: "Medicine and related schedules/logs deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};