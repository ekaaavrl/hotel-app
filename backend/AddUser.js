const bcrypt = require('bcrypt');
const db = require('./config/db'); // pastikan path benar

async function insertUser() {
    try {
        const username = 'staff01';
        const passwordPlain = 'staff1';
        const full_name = 'Staff 1';
        const email = 'staff@hotel.com';
        const role = 'staff'; // Sesuai ENUM: admin, receptionist, manager, staff

        const hashedPassword = await bcrypt.hash(passwordPlain, 10);

        const [result] = await db.execute(
            `INSERT INTO users (username, password_hash, full_name, email, role) 
       VALUES (?, ?, ?, ?, ?)`,
            [username, hashedPassword, full_name, email, role]
        );

        console.log('Insert Success. ID User:', result.insertId);
    } catch (err) {
        console.error('Failed Insert:', err.message);
    }
}

insertUser();
