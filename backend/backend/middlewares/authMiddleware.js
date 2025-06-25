const jwt = require('jsonwebtoken');
const User = require('../models/user'); // <-- Make sure this is imported

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token: user not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.userType !== requiredRole) {
            return res.status(403).json({ error: 'Access denied, insufficient permissions' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRole };
