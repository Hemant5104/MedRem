import mongoose from "mongoose";

const intakeLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine"
    },

    date: { type: Date },   // scheduled date

    time: { type: String }, // "08:00"

    status: {
      type: String,
      enum: ["TAKEN", "MISSED"],
      default: "MISSED"
    }
  },
  { timestamps: true }
);

export default mongoose.model("IntakeLog", intakeLogSchema);
