import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true
    },

    times: [String],    // ["08:00", "14:00", "20:00"]

    frequency: {
      type: String,
      enum: ["DAILY", "ALTERNATE", "CUSTOM"],
      default: "DAILY"
    },

    days: [String]      // ["Mon", "Wed", "Fri"]
  },
  { timestamps: true }
);

const schedule= mongoose.model("Schedule", scheduleSchema);
export default schedule
