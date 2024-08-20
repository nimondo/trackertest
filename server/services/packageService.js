const Package = require("../models/package");
const {
    v4: uuidv4
} = require("uuid");

exports.createPackage = async (packageData) => {
    const packageToSave = new Package({
        _id: uuidv4(),
        ...packageData,
    });
    await packageToSave.save();
    return packageToSave;
};

exports.getPackageById = async (id) => {
    return Package.findById(id).populate("active_delivery_id");
};

exports.getAllPackages = async (filter, pageNumber, limit) => {
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

    return result;
};

exports.updatePackage = async (id, packageData) => {
    return Package.findByIdAndUpdate(id, packageData, {
        new: true,
        runValidators: true,
    });
};

exports.deletePackage = async (id) => {
    return Package.findByIdAndDelete(id);
};