const db = require("../config/db");

exports.getAllLogs = async () => {
    const [rows] = await db.query(`
        SELECT logs.*, users.full_name 
        FROM user_logs logs 
        JOIN users ON logs.user_id = users.user_id 
        ORDER BY log_time DESC
    `);
    return rows;
};

exports.addLog = async (userId, action, description, ip) => {
    await db.query(
        `INSERT INTO user_logs (user_id, action_type, description, ip_address) VALUES (?, ?, ?, ?)`,
        [userId, action, description, ip]
    );
};
