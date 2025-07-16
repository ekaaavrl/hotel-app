const bcrypt = require('bcrypt');
const db = require('./config/db'); // pastikan path benar

async function insertUser() {
    try {
<<<<<<< HEAD
        const username = 'staff01';
        const passwordPlain = 'staff1';
        const full_name = 'Staff 1';
        const email = 'staff@hotel.com';
        const role = 'staff'; // Sesuai ENUM: admin, receptionist, manager, staff
=======
        const username = 'admin01';
        const passwordPlain = 'admin1';
        const full_name = 'Admin Utama';
        const email = 'admin@hotel.com';
        const role = 'admin'; // Sesuai ENUM: admin, receptionist, manager, staff
>>>>>>> 5928a009d420907882d4d4fe51164a8041244ba9

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
