const db = require("../config/db");

// Ambil semua layanan kamar + fee
const getAllServices = async () => {
    const [rows] = await db.query(`
        SELECT r.request_id, r.reservation_id, rs.guest_id, g.full_name,
               r.service_description, r.fee, r.request_time, r.status
        FROM room_service_requests r
        JOIN reservations rs ON r.reservation_id = rs.reservation_id
        JOIN guests g ON rs.guest_id = g.guest_id
        ORDER BY r.request_time DESC
    `);
    return rows;
};

// Ambil catatan layanan (untuk tampilan ringkasan)
const getServiceDescriptions = async (reservation_id) => {
    const [rows] = await db.query(`
        SELECT service_description 
        FROM room_service_requests 
        WHERE reservation_id = ? AND status = 'completed'
    `, [reservation_id]);

    return rows.map(r => `• ${r.service_description}`).join("\n");
};

// Tambah layanan (include fee)
const createService = async (data) => {
    const { reservation_id, service_description, status, fee } = data;
    await db.query(
        `INSERT INTO room_service_requests (reservation_id, service_description, status, fee)
         VALUES (?, ?, ?, ?)`,
        [reservation_id, service_description, status || "pending", fee || 0]
    );
};

// Edit layanan (include fee)
const updateService = async (id, data) => {
    const { service_description, status, fee } = data;
    await db.query(
        `UPDATE room_service_requests
         SET service_description = ?, status = ?, fee = ?
         WHERE request_id = ?`,
        [service_description, status, fee || 0, id]
    );
};

const deleteService = async (id) => {
    await db.query(`DELETE FROM room_service_requests WHERE request_id = ?`, [id]);
};

module.exports = {
    getAllServices,
    getServiceDescriptions,
    createService,
    updateService,
    deleteService,
};
