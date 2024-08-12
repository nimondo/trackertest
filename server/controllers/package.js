const Package = require("../models/package");
const logger = require("../logger");
const handleAsync = require("../utils/handleAsync");
const JwtUtils = require("../utils/jwtUtils");
const {
  v4: uuidv4
} = require("uuid");

exports.createPackage = handleAsync(async (req, res) => {
  const packageData = {
    _id: uuidv4(),
    ...req.body,
  };
  const packageToSave = new Package(packageData);
  await packageToSave.save();
  logger.info(`Package created with ID: ${packageToSave._id}`);
  res.status(201).json({
    message: "Package created!",
  });
});

exports.getPackageById = handleAsync(async (req, res) => {
  const packageData = await Package.findById(req.params.id).populate("active_delivery_id");
  if (!packageData) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found",
    });
  }
  logger.info(`Fetched package with ID ${req.params.id}`);
  res.status(200).json({
    packageData,
  });
});

exports.getAllPackages = handleAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken = JwtUtils.decodeToken(token);
  let filter = {};
  if (decodedToken.data.role != "admin")
    filter.userId = decodedToken.data.userId;

  console.log("filter", filter)
  const pageNumber = parseInt(req.query.page, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = pageNumber * limit;
  const endIndex = startIndex + limit;

  const totalPackages = await Package.countDocuments(filter).exec();

  const result = {
    totalPackages,
    rowsPerPage: limit,
    previous: startIndex > 0 ? {
      pageNumber: pageNumber - 1,
      limit
    } : undefined,
    next: endIndex < totalPackages ? {
      pageNumber: pageNumber + 1,
      limit
    } : undefined,
    data: await Package.find(filter)
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec(),
  };

  logger.info("Fetched packages", result);
  res.status(200).json({
    msg: "Packages fetched successfully",
    data: result,
  });
});

exports.updatePackage = handleAsync(async (req, res) => {
  const packageData = {
    ...req.body
  };
  const updatedPackage = await Package.findByIdAndUpdate(req.params.id, packageData, {
    new: true,
    runValidators: true,
  });

  if (!updatedPackage) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found",
    });
  }

  logger.info(`Updated package with ID ${req.params.id}`);
  res.status(200).json({
    message: "Package updated!",
  });
});

exports.deletePackage = handleAsync(async (req, res) => {
  const deletedPackage = await Package.findByIdAndDelete(req.params.id);

  if (!deletedPackage) {
    logger.warn(`Package with ID ${req.params.id} not found`);
    return res.status(404).json({
      message: "Package not found",
    });
  }

  logger.info(`Deleted package with ID ${req.params.id}`);
  res.status(200).json({
    message: "Package deleted!",
  });
});