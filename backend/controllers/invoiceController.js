const db = require("../config/db");

const getInvoiceByReservationId = async (req, res) => {
    try {
        const { reservation_id } = req.params;

        // 1. Ambil data invoice utama
        const [rows] = await db.query(`
            SELECT 
                r.reservation_id,
                g.full_name AS guest_name,
                rm.room_number,
                r.check_in_date AS check_in,
                r.check_out_date AS check_out,
                r.total_price,
                p.amount_paid,
                p.payment_date,
                p.payment_method
            FROM reservations r
            JOIN guests g ON r.guest_id = g.guest_id
            JOIN rooms rm ON r.room_id = rm.room_id
            JOIN payments p ON p.reservation_id = r.reservation_id
            WHERE r.reservation_id = ?
            LIMIT 1
        `, [reservation_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Data invoice tidak ditemukan" });
        }

        const invoice = rows[0];

        // 2. Ambil detail layanan tambahan
        const [serviceRows] = await db.query(`
            SELECT service_description, fee
            FROM room_service_requests
            WHERE reservation_id = ?
        `, [reservation_id]);

        // 3. Hitung total fee tambahan dari layanan
        const additional_fee = serviceRows.reduce((sum, item) => sum + Number(item.fee || 0), 0);

        // 4. Tambahkan ke response
        invoice.services = serviceRows;
        invoice.additional_fee = additional_fee;

        return res.json(invoice);
    } catch (err) {
        console.error("Gagal ambil invoice:", err);
        res.status(500).json({ message: "Gagal mengambil data invoice" });
    }
};

module.exports = { getInvoiceByReservationId };
