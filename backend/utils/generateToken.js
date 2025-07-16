const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

module.exports = { generateToken };
