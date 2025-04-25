import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: {
        validator: function (value) {
          return mongoose.Types.ObjectId.isValid(value); // Ensure valid ObjectId
        },
      },
    },
    title: {
      type: String,
      required: true,
      minlength: 3, // Title must be at least 3 characters
      maxlength: 40, // Title can't exceed 100 characters
    },
    listingImage: { type: String, required: true },
    location: {
      type: String,
      required: true,
      minlength: 3, // Location must be at least 3 characters
      maxlength: 100, // Location can't exceed 200 characters
    },
    country: {
      type: String,
      required: true,
      minlength: 3, // Country name must be at least 2 characters
      maxlength: 50, // Country name can't exceed 100 characters
    },
    description: {
      type: String,
      required: true,
      minlength: 10, // Description must be at least 10 characters
      maxlength: 250, // Description can't exceed 1000 characters
    },
    priceUnit: {
      type: String,
      required: true,
      enum: ["hour", "day", "week", "month"],
      default: "hour",
    },
    tags: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5; // Maximum 5 tags allowed
        },
        message: "Cannot have more than 5 tags",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 1, // Price can't be negative
      max: 200000,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    availableFrom: {
      type: Date,
      // required: true,
      validate: {
        validator: function (value) {
          return value >= new Date(); // Ensure "availableFrom" is a future date
        },
      },
    },
    availableUntil: {
      type: Date,
      // required: true,
      validate: {
        validator: function (value) {
          return value > this.availableFrom; // Ensure "availableUntil" is after "availableFrom"
        },
      },
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
