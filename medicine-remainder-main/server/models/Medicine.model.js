import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: { type: String, required: true },

    type: {
      type: String,
      enum: ["TABLET", "SYRUP", "INJECTION"],
      default: "TABLET"
    },

    dosage: { type: String },           // 500mg
    quantityPerDose: { type: Number },  // 1 tablet

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    instructions: { type: String },     // after food

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);
