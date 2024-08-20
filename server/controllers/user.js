const userService = require('../services/userSevice');
const handleAsync = require('../utils/handleAsync');

exports.signup = handleAsync(async (req, res, next) => {
  const {
    email,
    password,
    role
  } = req.body;

  try {
    const user = await userService.signup({
      email,
      password,
      role
    });
    res.status(201).json({
      message: 'User created successfully!'
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

exports.login = handleAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  try {
    const {
      userId,
      role,
      email: userEmail,
      token
    } = await userService.login({
      email,
      password
    });
    res.status(200).json({
      userId,
      role,
      email: userEmail,
      token
    });
  } catch (error) {
    res.status(401).json({
      error: error.message
    });
  }
});