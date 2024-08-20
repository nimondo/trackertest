const packageService = require('../services/packageService');
const logger = require("../logger");
const handleAsync = require("../utils/handleAsync");
const JwtUtils = require("../utils/jwtUtils");
const {
  userRole
} = require('../models/user');

exports.createPackage = handleAsync(async (req, res) => {
  const packageToSave = await packageService.createPackage(req.body);
  logger.info(`Package created with ID: ${packageToSave._id}`);
  res.status(201).json({
    message: "Package created!"
  });
});

exports.getPackageById = handleAsync(async (req, res) => {
  const packageData = await packageService.getPackageById(req.params.id);
  if (!packageData) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found"
    });
  }
  logger.info(`Fetched package with ID ${req.params.id}`);
  res.status(200).json({
    packageData
  });
});

exports.getAllPackages = handleAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken = JwtUtils.decodeToken(token);
  let filter = {};

  if (decodedToken.data.role === userRole.CUSTOMER)
    filter.userId = decodedToken.data.userId;

  const pageNumber = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 12;

  const result = await packageService.getAllPackages(filter, pageNumber, limit);

  logger.info("Fetched packages", result);
  res.status(200).json({
    msg: "Packages fetched successfully",
    data: result
  });
});

exports.updatePackage = handleAsync(async (req, res) => {
  const updatedPackage = await packageService.updatePackage(req.params.id, req.body);
  if (!updatedPackage) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found"
    });
  }
  logger.info(`Updated package with ID ${req.params.id}`);
  res.status(200).json({
    message: "Package updated!"
  });
});

exports.deletePackage = handleAsync(async (req, res) => {
  const deletedPackage = await packageService.deletePackage(req.params.id);
  if (!deletedPackage) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found"
    });
  }
  logger.info(`Deleted package with ID ${req.params.id}`);
  res.status(200).json({
    message: "Package deleted!"
  });
});