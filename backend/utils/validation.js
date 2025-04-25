import Joi from "joi";
import { cloudinary } from "../cloudConfig.js";

// Joi validation schema for user registration
const userValidationSchema = Joi.object({
  username: Joi.string().trim().min(3).max(20).required().messages({
    "string.username": "Please enter a username",
    "string.empty": "username should not be empty.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org"] } })
    .required()
    .messages({ "string.email": "Please enter a valid email address" }),
  password: Joi.string().trim().min(8).max(20).required().messages({
    "string.min": "Password should be at least 6 characters long",
    "string.max": "Password should not exceed 50 characters",
    "string.empty": "password should not be empty.",
  }),
  profilePicture: Joi.string().uri().optional(),
});

const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.log();
    const errorMessage = error.details[0].message;
    return res.status(400).json({
      status: "error",
      error: errorMessage,
    });
  }

  next();
};

//**************** workspace validation ********

// Joi schema for  with custom error messages
const workspaceValidationSchema = Joi.object({
  owner: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validate ObjectId format (24 hex characters)
    .optional()
    .messages({
      "string.pattern.base":
        "Invalid owner ID. Please provide a valid ObjectId.",
    }),
  title: Joi.string().trim().min(3).max(40).required().messages({
    "string.min": "Title should be at least 3 characters long.",
    "string.max": "Title should not exceed 40 characters.",
    "any.required": "Title is required.",
    "string.empty": "title should not be empty.",
  }),
  listingImage: Joi.string().allow("", null),
  location: Joi.string().trim().min(3).max(100).required().messages({
    "string.min": "Location should be at least 3 characters long.",
    "string.max": "Location should not exceed 100 characters.",
    "any.required": "Location is required.",
    "string.empty": "location should not be empty.",
  }),
  country: Joi.string().trim().min(3).max(50).required().messages({
    "string.min": "Country name should be at least 3 characters long.",
    "string.max": "Country name should not exceed 50 characters.",
    "any.required": "Country is required.",
    "string.empty": "country  should not be empty",
  }),
  description: Joi.string().trim().min(10).max(250).required().messages({
    "string.min": "Description should be at least 10 characters long.",
    "string.max": "Description should not exceed 250 characters.",
    "any.required": "Description is required.",
    "string.empty": "description should not be empty.",
  }),
  priceUnit: Joi.string()
    .valid("hour", "day", "week", "month")
    .default("hour")
    .messages({
      "any.only": "Price unit must be one of: hour, day, week, month",
      "string.empty": "Price unit should not be empty",
    }),
  tags: Joi.array().items(Joi.string()).max(5).messages({
    "array.max": "Cannot have more than 5 tags",
    "array.base": "Tags must be an array",
  }),
  price: Joi.number().min(1).max(200000).required().messages({
    "number.min": "Price should be at least 1.",
    "number.max": "Price should not exceed 200,000.",
    "any.required": "Price is required.",
  }),
  isPopular: Joi.boolean().default(false).messages({
    "boolean.base": "isPopular must be a boolean value",
  }),
  avgRating: Joi.number().min(0).max(5).default(0).messages({
    "number.min": "Average rating cannot be less than 0",
    "number.max": "Average rating cannot be more than 5",
  }),
  availableFrom: Joi.date().min("now").optional().messages({
    "date.min": "Available from date should be in the future.",
  }),
  availableUntil: Joi.date()
    .greater(Joi.ref("availableFrom"))
    .optional()
    .messages({
      "date.greater":
        "Available until date should be after the 'Available from' date.",
    }),
});

const validateWorkspace = (req, res, next) => {
  console.log("workspace validation", req.body, req.file);
  const { error } = workspaceValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({
      status: "error",
      message: errorMessage,
    });
  }
  next();
};

export { validateUser, validateWorkspace };
