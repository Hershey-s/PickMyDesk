import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const CreateWorkspace = () => {
  const [preview, setPreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // success | error
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      priceUnit: "hour",
      isPopular: false,
      avgRating: 0,
      tags: [],
    },
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const availableFrom = watch("availableFrom");
  const selectedFile = watch("listingImage");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSizeInBytes = 50 * 1024 * 1024; // 50MB

      if (!validTypes.includes(file.type)) {
        setError("listingImage", {
          type: "manual",
          message: "Please upload a valid image file (JPEG, PNG, GIF).",
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        setError("listingImage", {
          type: "manual",
          message: "File size should not exceed 5MB.",
        });
        return;
      }

      clearErrors("listingImage");
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      setIsLoading(true);
      // Add tags to the form data
      data.tags = tags;
      console.log(data);
      const response = await axios.post(
        "http://localhost:5000/workspaces",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("success===>", response);
      // Show success message
      setSnackbarMessage(response.data.message);
      setSnackbarType("success");
      setOpenSnackbar(true);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      // Show error message
      console.log("error===>", error);
      setSnackbarMessage(error.response?.data?.message || "An error occurred");
      setSnackbarType("error");
      setOpenSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="pb-4 mx-2">
        <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-2">
          Create Workspace
        </h2>
        <p className="text-gray-700 font-normal">
          Add your workspace details to make it available for bookings.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 border border-gray-200 p-8 mx-2 rounded-lg"
        encType="multipart/form-data"
      >
        {/* Workspace Title */}
        <div className="col-span-3">
          <label htmlFor="title" className="block font-medium text-lg">
            Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title should be at least 3 characters long",
              },
              maxLength: {
                value: 40,
                message: "Title should not exceed 40 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., Heritage Haveli in Jaipur"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        {/* Description */}
        <div className="col-span-3">
          <label htmlFor="description" className="block font-medium text-lg">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description should be at least 10 characters long",
              },
              maxLength: {
                value: 250,
                message: "Description should not exceed 250 characters",
              },
            })}
            className="w-full px-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., Traditional 3-bedroom Haveli near Hawa Mahal with free Wi-Fi and breakfast."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/*Upload Image */}
        {
          <div className="col-span-3">
            <label htmlFor="listingImage" className="block font-medium text-lg">
              Upload Image
            </label>
            <input
              type="text"
              id="listingImage"
              name="listingImage"
              {...register("listingImage", {
                required: "Listing image is required",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., https://example.com/your-image.jpg"
            />
            {errors.listingImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.listingImage.message}
              </p>
            )}
          </div>
        }

        {/* Price */}
        <div className="col-span-3 md:col-span-1">
          <label htmlFor="price" className="block font-medium text-lg">
            Price
          </label>
          <input
            type="number"
            id="price"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 1, message: "Price should be at least 1" },
              max: {
                value: 200000,
                message: "Price should not exceed 200,000",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., 2000"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        {/* Price Unit */}
        <div className="col-span-3 md:col-span-1">
          <label htmlFor="priceUnit" className="block font-medium text-lg">
            Price Unit
          </label>
          <select
            id="priceUnit"
            {...register("priceUnit")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          {errors.priceUnit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.priceUnit.message}
            </p>
          )}
        </div>
        {/* Country */}
        <div className="col-span-3 md:col-span-1">
          <label htmlFor="country" className="block font-medium text-lg">
            Country
          </label>
          <input
            type="text"
            id="country"
            {...register("country", {
              required: "Country is required",
              minLength: {
                value: 3,
                message: "Country name should be at least 3 characters long",
              },
              maxLength: {
                value: 50,
                message: "Country name should not exceed 50 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., India"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
        {/* Location */}
        <div className="col-span-3">
          <label htmlFor="location" className="block font-medium text-lg">
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register("location", {
              required: "Location is required",
              minLength: {
                value: 3,
                message: "Location should be at least 3 characters long",
              },
              maxLength: {
                value: 100,
                message: "Location should not exceed 100 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="e.g., Jaipur, Rajasthan"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
        {/* Tags */}
        <div className="col-span-3">
          <label htmlFor="tags" className="block font-medium text-lg">
            Tags (Max 5)
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., Coworking, Quiet, Wi-Fi"
              disabled={tags.length >= 5}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={tags.length >= 5}
              className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none"
            >
              Add
            </button>
          </div>
          {tags.length >= 5 && (
            <p className="text-amber-500 text-sm mt-1">
              Maximum 5 tags allowed
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
              >
                <span className="text-sm mr-1">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Available From */}
        <div className="col-span-3 md:col-span-1">
          <label htmlFor="availableFrom" className="block font-medium text-lg">
            Available From
          </label>
          <input
            type="date"
            id="availableFrom"
            {...register("availableFrom", {
              validate: (value) => {
                if (value) {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  return (
                    new Date(value) >= now ||
                    "Available from date should be in the future"
                  );
                }
                return true;
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          {errors.availableFrom && (
            <p className="text-red-500 text-sm mt-1">
              {errors.availableFrom.message}
            </p>
          )}
        </div>
        {/* Available Until */}
        <div className="col-span-3 md:col-span-1">
          <label htmlFor="availableUntil" className="block font-medium text-lg">
            Available Until
          </label>
          <input
            type="date"
            id="availableUntil"
            {...register("availableUntil", {
              validate: (value) => {
                if (value && availableFrom) {
                  return (
                    new Date(value) > new Date(availableFrom) ||
                    "Available until date should be after the 'Available from' date"
                  );
                }
                return true;
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          {errors.availableUntil && (
            <p className="text-red-500 text-sm mt-1">
              {errors.availableUntil.message}
            </p>
          )}
        </div>
        {/* Is Popular */}
        <div className="col-span-3 md:col-span-1">
          <div className="flex items-center h-full pt-4">
            <input
              type="checkbox"
              id="isPopular"
              {...register("isPopular")}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isPopular" className="ml-2 block font-medium">
              Mark as Popular
            </label>
          </div>
        </div>
        {/* Submit Button */}
        <div className="col-span-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 font-extrabold ${
              isLoading ? "bg-black" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Workspace"}
          </button>
        </div>
      </form>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          "& .MuiSnackbarContent-message": {
            color: snackbarType === "success" ? "green" : "red",
            fontWeight: "bold",
          },
        }}
      />
    </div>
  );
};

export default CreateWorkspace;
