import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import medicineRoutes from "./routes/medicine.route.js";
import "./services/reminder.service.js";
import intakeRoutes from "./routes/intake.route.js";
import  scheduleRoutes from './routes/schedule.route.js'
import profileRoutes from './routes/profile.route.js'


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.json({ status: "Medicine Reminder API running" });
});


//routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/schedules",scheduleRoutes)
app.use("/api/intake", intakeRoutes);
app.use("/api/profile", profileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
