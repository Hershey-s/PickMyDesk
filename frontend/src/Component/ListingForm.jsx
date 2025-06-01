import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const CreateWorkspace = () => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
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
    setError,
    clearErrors,
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

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError("listingImage", {
          type: "manual",
          message: "Please upload a valid image file (JPEG, PNG, GIF, WebP).",
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
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      setIsLoading(true);

      console.log("🔍 Form data received:", data);
      console.log("🔍 Tags:", tags);
      console.log("🔍 Selected file:", selectedFile);
      console.log("🔍 Token:", token ? "Token exists" : "No token");

      // Check if user is logged in
      if (!token) {
        setSnackbarMessage("Please login as admin to create workspace");
        setSnackbarType("error");
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      // Validate required fields - provide default title if missing
      if (!data.title || data.title.trim() === "") {
        console.log("⚠️ Title missing, using location as title");
        data.title = data.location || "Workspace";
      }

      console.log("✅ Title after validation:", data.title);

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
          console.log(`📝 Adding field: ${key} = ${data[key]}`);
        }
      });

      // Add tags
      formData.append("tags", JSON.stringify(tags));
      console.log("📝 Adding tags:", JSON.stringify(tags));

      // Add image file if selected
      if (selectedFile) {
        formData.append("listingImage", selectedFile);
        console.log("📝 Adding image file:", selectedFile.name);
      } else {
        // Use a default image URL if no file selected
        formData.append(
          "listingImage",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"
        );
        console.log("📝 Using default image");
      }

      // Add currency field
      formData.append("currency", "INR");

      console.log("🚀 Submitting form data...");
      console.log("🌐 API URL:", import.meta.env.VITE_API_URL);

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5006";
      console.log("📡 Making request to:", `${baseURL}/workspaces`);

      // Log FormData contents
      console.log("📦 FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const response = await axios.post(`${baseURL}/workspaces`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ SUCCESS Response:", response);

      // Check user role for appropriate message
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const successMessage =
        user?.role === "admin"
          ? "Workspace created successfully! Redirecting to manage workspaces..."
          : "Workspace created successfully!";

      setSnackbarMessage(response.data.message || successMessage);
      setSnackbarType("success");
      setOpenSnackbar(true);
      setIsLoading(false);

      // Redirect based on user role after a short delay
      setTimeout(() => {
        if (userData) {
          const userForRedirect = JSON.parse(userData);
          if (userForRedirect.role === "admin") {
            // Redirect to workspace management page for admins
            console.log("🔄 Redirecting admin to workspace management...");
            navigate("/admin/workspaces");
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      }, 1500); // 1.5 second delay to show success message
    } catch (error) {
      console.error("❌ ERROR Details:");
      console.error("Status:", error.response?.status);
      console.error("Status Text:", error.response?.statusText);
      console.error("Response Data:", error.response?.data);
      console.error("Request Config:", error.config);
      console.error("Full Error:", error);

      let errorMessage = "An error occurred while creating workspace";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.details) {
        errorMessage = error.response.data.details.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSnackbarMessage(errorMessage);
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
        {/* Workspace Title - REQUIRED FIELD */}
        <div className="col-span-3">
          <label
            htmlFor="title"
            className="block font-medium text-lg text-red-600"
          >
            Title *
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
            className="w-full px-4 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            placeholder="e.g., Modern Co-working Space in Bengaluru"
            style={{ backgroundColor: "#fef2f2" }}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 font-bold">
              {errors.title.message}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            This field is required and must be filled
          </p>
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

        {/* Upload Image */}
        <div className="col-span-3">
          <label
            htmlFor="listingImage"
            className="block font-medium text-lg mb-2"
          >
            Upload Workspace Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <input
              type="file"
              id="listingImage"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="listingImage"
              className="cursor-pointer flex flex-col items-center"
            >
              {preview ? (
                <div className="mb-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg shadow-md"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              )}
              <p className="text-sm text-gray-600 mb-2">
                {selectedFile ? selectedFile.name : "Click to upload an image"}
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF, WebP up to 5MB
              </p>
            </label>
          </div>
          {errors.listingImage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.listingImage.message}
            </p>
          )}
        </div>

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
