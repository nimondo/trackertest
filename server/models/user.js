const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 7200000; // 2 heures

const userRole = {
  ADMIN: "admin",
  DRIVER: "driver",
  CUSTOMER: "customer"
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,  // Empêche d'envoyer le password par défaut dans les requêtes
  },
  role: {
    type: String,
    enum: [userRole.CUSTOMER, userRole.DRIVER, userRole.ADMIN],
    default: userRole.CUSTOMER,
    required: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Number,
  },
  lastLogin: {
    type: Date,
  }
});

// Virtual property pour savoir si le compte est verrouillé
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 🔒 **Hachage du mot de passe avant sauvegarde**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔒 **Hachage du mot de passe avant mise à jour**
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// 🔄 **Comparaison du mot de passe**
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔄 **Incrémentation des tentatives de connexion**
userSchema.methods.incLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }).exec();
  }

  let updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.updateOne(updates).exec();
};

// 📌 **Enum pour les raisons d'échec de connexion**
const reasons = {
  NOT_FOUND: 0,
  INACTIVE: 1,
  PASSWORD_INCORRECT: 2,
  MAX_ATTEMPTS: 3,
};

// 📌 **Retourne un message d'erreur approprié**
userSchema.statics.reasonMessage = function (reason) {
  switch (reason) {
    case reasons.NOT_FOUND:
    case reasons.PASSWORD_INCORRECT:
      return "Compte ou mot de passe invalide";
    case reasons.INACTIVE:
      return "Compte non actif";
    case reasons.MAX_ATTEMPTS:
      return "Maximum de tentatives atteint, veuillez réessayer dans 2 heures";
    default:
      return "Raison inconnue";
  }
};

// 🔑 **Authentification utilisateur**
userSchema.statics.getAuthenticated = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select("+password").lean(); // Sécurisé et optimisé

    if (!user) return { user: null, reason: reasons.NOT_FOUND };
    if (user.isLocked) {
      await this.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } });
      return { user: null, reason: reasons.MAX_ATTEMPTS };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      await this.findByIdAndUpdate(user._id, { 
        $set: { loginAttempts: 0, lastLogin: new Date() }, 
        $unset: { lockUntil: 1 } 
      });

      return { user };
    }

    await this.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } });
    return { user: null, reason: reasons.PASSWORD_INCORRECT };
  } catch (error) {
    console.error("Authentication error:", error);
    return { user: null, reason: "INTERNAL_ERROR" };
  }
};

// 🔍 **Ajout du plugin uniqueValidator**
userSchema.plugin(uniqueValidator);

module.exports = {
  User: mongoose.model("User", userSchema),
  userRole
};
