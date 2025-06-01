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
    // Geographic coordinates for location-based features
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    // Full address for better location context
    fullAddress: {
      type: String,
      maxlength: 200,
    },
    city: {
      type: String,
      maxlength: 50,
    },
    state: {
      type: String,
      maxlength: 50,
    },
    zipCode: {
      type: String,
      maxlength: 20,
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
    currency: {
      type: String,
      enum: ["USD", "INR", "EUR", "GBP"],
      default: "INR",
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
    // Booking-related fields
    maxCapacity: {
      type: Number,
      default: 20,
      min: 1,
      max: 50,
    },
    amenities: {
      type: [String],
      default: [],
    },
    availability: {
      type: {
        monday: { start: String, end: String, available: Boolean },
        tuesday: { start: String, end: String, available: Boolean },
        wednesday: { start: String, end: String, available: Boolean },
        thursday: { start: String, end: String, available: Boolean },
        friday: { start: String, end: String, available: Boolean },
        saturday: { start: String, end: String, available: Boolean },
        sunday: { start: String, end: String, available: Boolean },
      },
      default: {
        monday: { start: "09:00", end: "18:00", available: true },
        tuesday: { start: "09:00", end: "18:00", available: true },
        wednesday: { start: "09:00", end: "18:00", available: true },
        thursday: { start: "09:00", end: "18:00", available: true },
        friday: { start: "09:00", end: "18:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: true },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
    instantBooking: {
      type: Boolean,
      default: true,
    },
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict"],
      default: "moderate",
    },
    minimumBookingDuration: {
      type: Number,
      default: 1, // 1 hour or 1 day depending on priceUnit
    },
    maximumBookingDuration: {
      type: Number,
      default: 30, // 30 hours or 30 days depending on priceUnit
    },
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
