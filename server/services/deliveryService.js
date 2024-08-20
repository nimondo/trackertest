const Delivery = require('../models/delivery');
const {
    v4: uuidv4
} = require('uuid');

exports.getAllDeliveries = async (filter, pageNumber, limit) => {
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

    return result;
};

exports.createDelivery = async (deliveryData) => {
    const delivery = new Delivery({
        _id: uuidv4(),
        ...deliveryData,
    });
    await delivery.save();
    return delivery;
};

exports.getDeliveryById = async (id) => {
    return Delivery.findById(id).populate("package_id");
};

exports.updateDelivery = async (id, deliveryData) => {
    return Delivery.findByIdAndUpdate(id, deliveryData, {
        new: true,
        runValidators: true,
    });
};

exports.deleteDelivery = async (id) => {
    return Delivery.findByIdAndDelete(id);
};