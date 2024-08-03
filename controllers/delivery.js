const Delivery = require('../models/Delivery');
const logger = require('../logger');
const handleAsync = require('../utils/handleAsync');
const {
  v4: uuidv4
} = require('uuid');

exports.getAllDeliveries = handleAsync(async (req, res) => {
  const deliveries = await Delivery.find();
  logger.info('Fetched all deliveries');
  res.status(200).json(deliveries);
});

exports.createDelivery = handleAsync(async (req, res) => {
  const deliveryData = {
    _id: uuidv4(),
    ...req.body
  };
  const delivery = new Delivery(deliveryData);
  await delivery.save();
  logger.info(`Created new delivery with ID: ${delivery._id}`);
  res.status(201).json({
    message: 'Delivery created successfully!'
  });
});

exports.getDeliveryById = handleAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    logger.warn(`Delivery with ID ${id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Fetched delivery with ID ${id}`);
  res.status(200).json(delivery);
});

exports.updateDelivery = handleAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const updatedDelivery = await Delivery.findByIdAndUpdate(id, {
    ...req.body
  }, {
    new: true,
    runValidators: true,
  });
  if (!updatedDelivery) {
    logger.warn(`Delivery with ID ${id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Updated delivery with ID ${id}`);
  res.status(200).json({
    message: 'Delivery updated successfully!',
    updatedDelivery
  });
});

exports.deleteDelivery = handleAsync(async (req, res) => {
  const {
    id
  } = req.params;
  const deletedDelivery = await Delivery.findByIdAndDelete(id);
  if (!deletedDelivery) {
    logger.warn(`Delivery with ID ${id} not found`);
    return res.status(404).json({
      message: 'Delivery not found'
    });
  }
  logger.info(`Deleted delivery with ID ${id}`);
  res.status(200).json({
    message: 'Delivery deleted successfully!'
  });
});