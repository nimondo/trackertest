const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require('../logger');
const handleAsync = require('../utils/handleAsync');
const validator = require('validator');
const passwordValidator = require("password-validator");
const passwdSchema = new passwordValidator();
passwdSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

exports.signup = handleAsync(async (req, res, next) => {
  const {
    email,
    password,
    role
  } = req.body;

  // Validation de l'email
  if (!validator.isEmail(email)) {
    logger.warn(`Invalid email format: ${email}`);
    return res.status(400).json({
      error: 'Invalid email format'
    });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    logger.warn(`User with email ${email} already exists`);
    return res.status(400).json({
      error: 'User with this email already exists'
    });
  }

  if (!passwdSchema.validate(password)) {
    return res.status(400).json({
      error: "Invalid password",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    password: hashedPassword,
    role
  });

  await user.save();
  logger.info('User created successfully');
  res.status(201).json({
    message: 'User created successfully!'
  });
});

exports.login = handleAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // Vérifier si l'utilisateur existe
  const user = await User.findOne({
    email
  });
  if (!user) {
    logger.warn(`User with email ${email} not found`);
    return res.status(401).json({
      error: 'User not found'
    });
  }

  // Vérifier le mot de passe
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    logger.warn('Invalid password');
    return res.status(401).json({
      error: 'Invalid password'
    });
  }

  // Générer un token
  const token = jwt.sign({
    userId: user._id,
    role: user.role,
    email: user.email
  }, process.env.TOKEN, {
    expiresIn: '24h'
  });
  logger.info(`User ${user.email} logged in successfully`);
  res.status(200).json({
    userId: user._id,
    role: user.role,
    email: user.email,
    token: token
  });
});