const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const deliveryRoutes = require("./routes/delivery");
const packageRoutes = require("./routes/package");
const defaultRoutes = require("./routes/default");
const userRoutes = require("./routes/user");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const logger = require('./logger'); // Importer le logger

// Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const SwaggerOptions = require("./swagger/swagger.json");
const swaggerDocument = swaggerJsDoc(SwaggerOptions);

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connection to MongoDB successful!"))
  .catch((error) => logger.error("Connection to MongoDB failed!", error));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

//delivery
app.use("/api/deliveries", deliveryRoutes);
//package
app.use("/api/packages", packageRoutes);
//auth
app.use("/api/auth", userRoutes);
//default
app.use("/api", defaultRoutes);

//api documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message
  });
});

module.exports = app;