const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ⬅️ user info (id, role, etc)
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token tidak valid" });
    }
};

// ✅ Middleware tambahan untuk cek role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Akses ditolak. Perlu role: " + allowedRoles.join(", ") });
        }
        next();
    };
};

module.exports = { auth, authorizeRoles };
