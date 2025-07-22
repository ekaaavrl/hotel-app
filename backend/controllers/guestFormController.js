const db = require("../config/db"); // Sesuaikan path ke koneksi database kamu

exports.createGuest = async (req, res) => {
    const { full_name, email, phone_number, address, id_number, nationality } = req.body;

    if (!full_name || !email) {
        return res.status(400).json({ message: "Nama dan email wajib diisi" });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO guests (full_name, email, phone_number, address, id_number, nationality)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [full_name, email, phone_number, address, id_number, nationality]
        );

        const [guest] = await db.query("SELECT * FROM guests WHERE guest_id = ?", [result.insertId]);
        res.status(201).json(guest[0]);
    } catch (err) {
        console.error("Gagal insert tamu:", err);
        res.status(500).json({ message: "Gagal menyimpan data tamu" });
    }
};
