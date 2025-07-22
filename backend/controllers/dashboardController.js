const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [guestsToday] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM guests 
      WHERE DATE(created_at) = CURDATE()
    `);

    const [roomsAvailable] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM (
        SELECT 
          r.room_id,
          CASE 
            WHEN EXISTS (
              SELECT 1 FROM reservations res
              WHERE res.room_id = r.room_id
              AND res.status = 'checked_in'
              AND CURDATE() BETWEEN res.check_in_date AND res.check_out_date
            ) THEN 'occupied'
            ELSE r.status
          END AS real_status
        FROM rooms r
      ) AS subquery
      WHERE real_status = 'available'
    `);

    const [activeReservations] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM reservations 
      WHERE status IN ('checked_in', 'booked')
    `);
    const [incomeToday] = await db.query(`
      SELECT SUM(amount_paid) AS total 
      FROM payments 
      WHERE DATE(payment_date) = CURDATE()
    `);

    res.json({
      guestsToday: guestsToday[0].total,
      roomsAvailable: roomsAvailable[0].total,
      activeReservations: activeReservations[0].total,
      incomeToday: incomeToday[0].total || 0
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 1. Jumlah tamu check-in hari ini
    const [guestsToday] = await db.query(`
      SELECT COUNT(*) AS total FROM reservations 
      WHERE DATE(check_in_date) = ? AND status = 'checked_in'
    `, [today]);

    res.json({
      success: true,
      data: {
        guestsToday: guestsToday[0].total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Gagal mengambil data dashboard" });
  }
};

exports.getAvailableRoomsToday = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [rows] = await db.query(
      `
      SELECT COUNT(*) AS available_rooms
      FROM rooms r
      WHERE NOT EXISTS (
          SELECT 1 FROM reservations res
          WHERE res.room_id = r.room_id
          AND res.status = 'checked_in'
          AND ? >= res.check_in_date
          AND ? < res.check_out_date
      )
      `
      ,
      [today, today]
    );

    res.json({
      success: true,
      data: rows[0].available_rooms,
    });
  } catch (error) {
    console.error("AvailableRooms Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data kamar tersedia",
    });
  }
};

//Total income today
exports.getIncomeToday = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [rows] = await db.query(
      `
      SELECT IFNULL(SUM(amount_paid), 0) AS income_today
      FROM payments
      WHERE DATE(payment_date) = ?
      `,
      [today]
    );

    res.json({
      success: true,
      data: rows[0].income_today,
    });
  } catch (error) {
    console.error("IncomeToday Error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data pemasukan hari ini",
    });
  }
};
