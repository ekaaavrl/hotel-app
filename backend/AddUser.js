const bcrypt = require('bcrypt');
const db = require('./config/db'); // pastikan path benar

async function insertUser() {
    try {
        const username = 'resep01';
        const passwordPlain = 'resep1';
        const full_name = 'Resepsionis A';
        const email = 'resep@hotel.com';
        const role = 'receptionist'; // Sesuai ENUM: admin, receptionist, manager, staff

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
