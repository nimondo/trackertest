const jwt = require('jsonwebtoken');

const secretKey = process.env.TOKEN;

function decodeToken(token) {
    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, secretKey);
        return {
            success: true,
            data: decoded
        };
    } catch (error) {
        // En cas d'erreur (ex: token expiré, invalide, etc.)
        return {
            success: false,
            message: 'Invalid token',
            error: error.message
        };
    }
}

module.exports = {
    decodeToken
};