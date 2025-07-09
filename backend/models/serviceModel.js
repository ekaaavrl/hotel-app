const db = require("../config/db");

const getAllServices = async () => {
    const [rows] = await db.query(`
    SELECT r.request_id, r.reservation_id, rs.guest_id, g.full_name, r.service_description, r.request_time, r.status
    FROM room_service_requests r
    JOIN reservations rs ON r.reservation_id = rs.reservation_id
    JOIN guests g ON rs.guest_id = g.guest_id
    ORDER BY r.request_time DESC
  `);
    return rows;
};

const createService = async (data) => {
    const { reservation_id, service_description, status } = data;
    await db.query(
        `INSERT INTO room_service_requests (reservation_id, service_description, status) VALUES (?, ?, ?)`,
        [reservation_id, service_description, status || "pending"]
    );
};

const updateService = async (id, data) => {
    const { service_description, status } = data;
    await db.query(
        `UPDATE room_service_requests SET service_description=?, status=? WHERE request_id = ?`,
        [service_description, status, id]
    );
};

const deleteService = async (id) => {
    await db.query(`DELETE FROM room_service_requests WHERE request_id = ?`, [id]);
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService,
};
