const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    printf,
    colorize
} = format;

// Format personnalisé pour les logs
const myFormat = printf(({
    level,
    message,
    timestamp
}) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Configuration du logger
const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(), // Coloriser les niveaux de logs
        timestamp(), // Ajouter des timestamps
        myFormat // Utiliser le format personnalisé
    ),
    transports: [
        new transports.Console(), // Afficher les logs dans la console
        new transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }), // Sauvegarder les logs d'erreurs dans un fichier
        new transports.File({
            filename: 'logs/combined.log'
        }), // Sauvegarder tous les logs dans un fichier
    ],
});

module.exports = logger;