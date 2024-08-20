const deliveryService = require('../services/deliveryService');
const logger = require('../logger');
const handleAsync = require('../utils/handleAsync');
const JwtUtils = require("../utils/jwtUtils");
const {
  userRole
} = require('../models/user');

exports.getAllDeliveries = handleAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken = JwtUtils.decodeToken(token);
  let filter = {};
  if (decodedToken.data.role !== userRole.ADMIN) {
    filter.userId = decodedToken.data.userId;
  }

  const pageNumber = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 12;

  const result = await deliveryService.getAllDeliveries(filter, pageNumber, limit);

  logger.info('Fetched deliveries');
  res.status(200).json({
    msg: 'Deliveries fetched successfully',
    data: result,
  });
});

exports.createDelivery = handleAsync(async (req, res) => {
  const delivery = await deliveryService.createDelivery(req.body);
  logger.info(`Created new delivery with ID: ${delivery._id}`);
  res.status(201).json({
    message: 'Delivery created successfully!'
  });
});

exports.getDeliveryById = handleAsync(async (req, res) => {
  const delivery = await deliveryService.getDeliveryById(req.params.id);
  if (!delivery) {
    logger.warn(`Delivery with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Fetched delivery with ID ${req.params.id}`);
  res.status(200).json(delivery);
});

exports.updateDelivery = handleAsync(async (req, res) => {
  const updatedDelivery = await deliveryService.updateDelivery(req.params.id, req.body);
  if (!updatedDelivery) {
    logger.warn(`Delivery with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Updated delivery with ID ${req.params.id}`);
  res.status(200).json({
    message: 'Delivery updated successfully!',
    updatedDelivery
  });
});

exports.deleteDelivery = handleAsync(async (req, res) => {
  const deletedDelivery = await deliveryService.deleteDelivery(req.params.id);
  if (!deletedDelivery) {
    logger.warn(`Delivery with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Deleted delivery with ID ${req.params.id}`);
  res.status(200).json({
    message: 'Delivery deleted successfully!'
  });
});