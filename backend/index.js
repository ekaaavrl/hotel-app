const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const guestRoutes = require("./routes/guestRoutes");
const guestFormRoutes = require("./routes/guestFormRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const roomTypeRoutes = require("./routes/roomTypeRoutes");
const roomRoutes = require("./routes/roomRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const staffRoutes = require("./routes/staffRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userLogRoutes = require("./routes/userLogRoutes");

// Gunakan routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api", guestFormRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/room-types", roomTypeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", userLogRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

// Fallback route untuk root path
app.get("/", (req, res) => {
    res.send("🎉 API Hotel Management berjalan!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
