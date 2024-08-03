const jwt = require('jsonwebtoken');

const roleData = {
  "admin": ["admin", "customer", "driver"],
  "driver": ["driver", "customer"],
  "customer": ["customer"]
};

const authRole = (role) => {
  return (req, res, next) => {
    // Check if Authorization header is present
    if (!req.headers.authorization) {
      res.status(401);
      return res.send("Authorization header is missing");
    }

    // Extract token from Authorization header
    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      res.status(401);
      return res.send("Invalid Authorization header format");
    }

    const token = tokenParts[1];

    // Verify and decode token
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN);
      const decodedRole = decodedToken.role;

      // Check if the user's role is allowed
      if (!roleData[decodedRole] || !roleData[decodedRole].includes(role)) {
        res.status(403);
        return res.send("Access denied");
      }

      // Proceed to the next middleware
      next();
    } catch (err) {
      res.status(401);
      return res.send("Invalid or expired token");
    }
  };
};

module.exports = {
  authRole,
};