const {
    User
} = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require('validator');
const passwordValidator = require("password-validator");
const logger = require('../logger');

const passwdSchema = new passwordValidator();
passwdSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces()
    .is().not().oneOf(["Passw0rd", "Password123"]);

exports.signup = async ({
    email,
    password,
    role
}) => {
    // Validation de l'email
    if (!validator.isEmail(email)) {
        logger.warn(`Invalid email format: ${email}`);
        throw new Error('Invalid email format');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
        email
    });
    if (existingUser) {
        logger.warn(`User with email ${email} already exists`);
        throw new Error('User with this email already exists');
    }

    // Validation du mot de passe
    if (!passwdSchema.validate(password)) {
        throw new Error('Invalid password');
    }

    // Hachage du mot de passe et création de l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        email,
        password: hashedPassword,
        role
    });

    await user.save();
    logger.info('User created successfully');
    return user;
};

exports.login = async ({
    email,
    password
}) => {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({
        email
    });
    if (!user) {
        logger.warn(`User with email ${email} not found`);
        throw new Error('User not found');
    }

    // Vérifier le mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        logger.warn('Invalid password');
        throw new Error('Invalid password');
    }

    // Générer un token
    const token = jwt.sign({
            userId: user._id,
            role: user.role,
            email: user.email
        },
        process.env.TOKEN, {
            expiresIn: '24h'
        }
    );

    logger.info(`User ${user.email} logged in successfully`);
    return {
        userId: user._id,
        role: user.role,
        email: user.email,
        token
    };
};