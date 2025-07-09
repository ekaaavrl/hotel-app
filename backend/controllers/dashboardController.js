const db = require("../config/db");
const getDashboardStats = async (req, res) => {
  try {
    const [guestsToday] = await db.query(`
      SELECT COUNT(*) AS total FROM reservations
      WHERE DATE(check_in_date) = CURDATE()
    `);

    const [roomsAvailable] = await db.query(`
      SELECT COUNT(*) AS total FROM rooms WHERE status = 'available'
    `);

    const [activeReservations] = await db.query(`
      SELECT COUNT(*) AS total FROM reservations
      WHERE status IN ('booked', 'checked_in')
    `);

    const [incomeToday] = await db.query(`
      SELECT SUM(amount_paid) AS total FROM payments
      WHERE DATE(payment_date) = CURDATE()
    `);

    res.json({
      guestsToday: guestsToday[0].total || 0,
      roomsAvailable: roomsAvailable[0].total || 0,
      activeReservations: activeReservations[0].total || 0,
      incomeToday: incomeToday[0].total || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data dashboard", error: err.message });
  }
};

// ✅ Tambahan Summary Chart untuk grafik pendapatan 7 hari terakhir
const getSummaryChart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(payment_date) AS date,
        SUM(amount_paid) AS total
      FROM payments
      WHERE payment_date >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(payment_date)
      ORDER BY date ASC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data chart", error: err.message });
  }
};
const getReservationChart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(check_in_date) AS date,
        COUNT(*) AS total
      FROM reservations
      WHERE check_in_date >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(check_in_date)
      ORDER BY date ASC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data chart reservasi", error: err.message });
  }
};

const getServiceChart = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE(request_date) AS date,
        COUNT(*) AS total
      FROM room_services
      WHERE request_date >= CURDATE() - INTERVAL 6 DAY
      GROUP BY DATE(request_date)
      ORDER BY date ASC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data chart layanan", error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getSummaryChart,
  getReservationChart,
  getServiceChart,

};
