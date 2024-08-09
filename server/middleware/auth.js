const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Check if Authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({
        error: "Authorization header missing"
      });
    }

    // Split and verify token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Token missing"
      });
    }

    // Verify and decode token
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const role = decodedToken.role;

    // Check if userId in request body matches the token's userId or if the role is admin
    if (req.body.userId && req.body.userId !== userId && role !== "admin") {
      return res.status(403).json({
        error: "Access denied: Invalid user ID or insufficient privileges"
      });
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(401).json({
      error: "Invalid request or expired token"
    });
  }
};