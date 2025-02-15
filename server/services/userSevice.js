const { User, userRole } = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const passwordValidator = require("password-validator");
const logger = require("../logger");

const passwdSchema = new passwordValidator();
passwdSchema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces()
  .is().not().oneOf(["Passw0rd", "Password123"]);

exports.signup = async ({ email, password, role }) => {
  try {
    // Validation de l'email
    if (!validator.isEmail(email)) {
      logger.warn(`Invalid email format: ${email}`);
      throw new Error("Invalid email format");
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`User with email ${email} already exists`);
      throw new Error("User with this email already exists");
    }

    // Validation du mot de passe
    if (!passwdSchema.validate(password)) {
      logger.warn("Invalid password format");
      throw new Error(
        "Password must be at least 8 characters, include uppercase, lowercase, and a digit, and have no spaces."
      );
    }

    // Création et sauvegarde de l'utilisateur
    const user = new User({ email, password, role });
    await user.save();

    logger.info(`User ${email} created successfully`);
    return { userId: user._id, email: user.email, role: user.role };
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    throw error;
  }
};

exports.login = async ({ email, password }) => {
  try {
    // Authentification avec gestion des erreurs
    const { user, reason } = await User.getAuthenticated(email, password);

    if (!user) {
      const errorMsg = User.reasonMessage(reason);
      logger.warn(`Login failed for ${email}: ${errorMsg}`);
      throw new Error(errorMsg);
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.TOKEN,
      { expiresIn: "24h" }
    );

    logger.info(`User ${user.email} logged in successfully`);
    return {
      userId: user._id,
      email: user.email,
      role: user.role,
      token,
    };
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};
