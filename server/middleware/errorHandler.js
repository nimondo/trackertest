const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message}`);
    res.status(err.status || 500).json({
        error: err.message
    });
};

module.exports = errorHandler;