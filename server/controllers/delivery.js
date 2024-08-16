const Delivery = require('../models/delivery');
const logger = require('../logger');
const handleAsync = require('../utils/handleAsync');
const JwtUtils = require("../utils/jwtUtils");
const {
  v4: uuidv4
} = require('uuid');

let admin = "admin";

exports.getAllDeliveries = handleAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken = JwtUtils.decodeToken(token);
  let filter = {};
  if (decodedToken.data.role != admin)
    filter.userId = decodedToken.data.userId;

  const pageNumber = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 12;

  const startIndex = pageNumber * limit;
  const endIndex = startIndex + limit;

  const totalDeliveries = await Delivery.countDocuments(filter).exec();

  const result = {
    totalDeliveries,
    rowsPerPage: limit,
    previous: startIndex > 0 ? {
      pageNumber: pageNumber - 1,
      limit
    } : undefined,
    next: endIndex < totalDeliveries ? {
      pageNumber: pageNumber + 1,
      limit
    } : undefined,
    data: await Delivery.find(filter)
      .sort('-_id')
      .skip(startIndex)
      .limit(limit)
      .exec(),
  };

  logger.info('Fetched deliveries');
  res.status(200).json({
    msg: 'Deliveries fetched successfully',
    data: result,
  });
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
  const delivery = await Delivery.findById(id).populate("package_id");
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