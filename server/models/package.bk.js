const mongoose = require("mongoose");
const {
    v4: uuidv4
} = require("uuid");

const packageSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
    },
    active_delivery_id: {
        type: String,
        ref: "Delivery",
    },
    description: {
        type: String,
        required: [true, "Package description is required"],
        minlength: [10, "Description should be at least 10 characters long"],
    },
    width: {
        type: Number,
        required: [true, "Package width is required"],
        min: [1, "Width must be at least 1 cm"],
    },
    weight: {
        type: Number,
        required: [true, "Package weight is required"],
        min: [0.1, "Weight must be at least 0.1 kg"],
    },
    height: {
        type: Number,
        required: [true, "Package height is required"],
        min: [1, "Height must be at least 1 cm"],
    },
    depth: {
        type: Number,
        required: [true, "Package depth is required"],
        min: [1, "Depth must be at least 1 cm"],
    },
    from_name: {
        type: String,
        required: [true, "Sender's name is required"],
    },
    from_address: {
        type: String,
        required: [true, "Sender's address is required"],
    },
    from_location: {
        type: {
            lat: {
                type: String,
                required: [true, "Sender's latitude is required"],
                validate: {
                    validator: function (value) {
                        return /^-?\d+(\.\d+)?$/.test(value); // Validate latitude format
                    },
                    message: props => `${props.value} is not a valid latitude!`
                }
            },
            long: {
                type: String,
                required: [true, "Sender's longitude is required"],
                validate: {
                    validator: function (value) {
                        return /^-?\d+(\.\d+)?$/.test(value); // Validate longitude format
                    },
                    message: props => `${props.value} is not a valid longitude!`
                }
            },
        },
    },
    to_name: {
        type: String,
        required: [true, "Recipient's name is required"],
    },
    to_location: {
        type: {
            lat: {
                type: String,
                required: [true, "Recipient's latitude is required"],
                validate: {
                    validator: function (value) {
                        return /^-?\d+(\.\d+)?$/.test(value); // Validate latitude format
                    },
                    message: props => `${props.value} is not a valid latitude!`
                }
            },
            long: {
                type: String,
                required: [true, "Recipient's longitude is required"],
                validate: {
                    validator: function (value) {
                        return /^-?\d+(\.\d+)?$/.test(value); // Validate longitude format
                    },
                    message: props => `${props.value} is not a valid longitude!`
                }
            },
        },
    },
    to_address: {
        type: String,
        required: [true, "Recipient's address is required"],
    },
    userId: {
        type: String,
        ref: 'User',
        required: false
    },
}, {
    timestamps: true,
});

// Custom validation function example
packageSchema.path('weight').validate(function (value) {
    return value > 0;
}, 'Weight must be greater than zero');

module.exports = mongoose.model("Package", packageSchema);