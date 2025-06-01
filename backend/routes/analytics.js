import express from "express";
import Workspace from "../models/workspace.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/userReg.model.js";
import {
  authenticateToken,
  requireAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get comprehensive analytics data
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Overview metrics
    const totalBookings = await Booking.countDocuments({
      createdAt: { $gte: startDate },
    });

    const totalRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: startDate },
    });

    const totalWorkspaces = await Workspace.countDocuments();

    const averageBookingValue = totalRevenue[0]?.total
      ? Math.round(totalRevenue[0].total / totalBookings)
      : 0;

    // Calculate occupancy rate (simplified)
    const totalPossibleBookings = totalWorkspaces * parseInt(days) * 10; // Assuming 10 time slots per day
    const occupancyRate =
      totalPossibleBookings > 0
        ? Math.round((totalBookings / totalPossibleBookings) * 100 * 10) / 10
        : 0;

    // Booking trends (daily data)
    const bookingTrends = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          bookings: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // Popular workspaces
    const popularWorkspaces = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$workspace",
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "_id",
          foreignField: "_id",
          as: "workspaceInfo",
        },
      },
      { $unwind: "$workspaceInfo" },
      {
        $project: {
          name: "$workspaceInfo.title",
          bookings: 1,
          revenue: 1,
          rating: "$workspaceInfo.avgRating",
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]);

    // Revenue by location
    const revenueByLocation = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspaceInfo",
        },
      },
      { $unwind: "$workspaceInfo" },
      {
        $group: {
          _id: "$workspaceInfo.location",
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          location: "$_id",
          revenue: 1,
          bookings: 1,
          _id: 0,
        },
      },
    ]);

    // Calculate percentages for revenue by location
    const totalLocationRevenue = revenueByLocation.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const revenueByLocationWithPercentage = revenueByLocation.map((item) => ({
      ...item,
      percentage:
        totalLocationRevenue > 0
          ? Math.round((item.revenue / totalLocationRevenue) * 100)
          : 0,
    }));

    // User activity by hour (simplified - using booking creation times)
    const userActivity = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          users: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          hour: { $concat: [{ $toString: "$_id" }, ":00"] },
          users: 1,
          _id: 0,
        },
      },
    ]);

    // Fill missing hours with 0
    const allHours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, "0")}:00`,
      users: 0,
    }));

    userActivity.forEach((activity) => {
      const hourIndex = parseInt(activity.hour.split(":")[0]);
      if (hourIndex >= 0 && hourIndex < 24) {
        allHours[hourIndex].users = activity.users;
      }
    });

    // Peak hours analysis
    const peakHours = userActivity
      .sort((a, b) => b.users - a.users)
      .slice(0, 5)
      .map((item, index) => ({
        time: `${item.hour}-${(parseInt(item.hour.split(":")[0]) + 1)
          .toString()
          .padStart(2, "0")}:00`,
        bookings: item.users,
        percentage:
          totalBookings > 0
            ? Math.round((item.users / totalBookings) * 100 * 10) / 10
            : 0,
      }));

    const analytics = {
      overview: {
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        activeUsers,
        totalWorkspaces,
        averageBookingValue,
        occupancyRate,
      },
      bookingTrends,
      popularWorkspaces,
      revenueByLocation: revenueByLocationWithPercentage,
      userActivity: allHours.filter(
        (hour) =>
          parseInt(hour.hour.split(":")[0]) >= 6 &&
          parseInt(hour.hour.split(":")[0]) <= 20
      ), // Show only business hours
      peakHours,
    };

    res.json(analytics);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message,
    });
  }
});

// Get specific metric data
router.get(
  "/metric/:metricType",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { metricType } = req.params;
      const { days = 30 } = req.query;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));

      let data;

      switch (metricType) {
        case "revenue":
          data = await Booking.aggregate([
            {
              $match: {
                createdAt: { $gte: startDate },
                status: { $ne: "cancelled" },
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                value: { $sum: "$totalPrice" },
              },
            },
            { $sort: { _id: 1 } },
          ]);
          break;

        case "bookings":
          data = await Booking.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                value: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]);
          break;

        case "users":
          data = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                value: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]);
          break;

        default:
          return res.status(400).json({ message: "Invalid metric type" });
      }

      res.json(data);
    } catch (error) {
      console.error("Metric data error:", error);
      res.status(500).json({
        message: "Error fetching metric data",
        error: error.message,
      });
    }
  }
);

// Export analytics data
router.get("/export", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { format = "json", days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all analytics data
    const bookings = await Booking.find({ createdAt: { $gte: startDate } })
      .populate("workspace", "title location")
      .populate("user", "username email")
      .select("-__v");

    if (format === "csv") {
      // Convert to CSV format
      const csvData = bookings.map((booking) => ({
        Date: booking.createdAt.toISOString().split("T")[0],
        Workspace: booking.workspace?.title || "Unknown",
        Location: booking.workspace?.location || "Unknown",
        User: booking.user?.username || "Unknown",
        "Total Price": booking.totalPrice,
        Status: booking.status,
        "Start Date": booking.startDate,
        "End Date": booking.endDate,
      }));

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=analytics-export.csv"
      );

      // Simple CSV conversion
      const headers = Object.keys(csvData[0] || {});
      const csvContent = [
        headers.join(","),
        ...csvData.map((row) =>
          headers.map((header) => `"${row[header]}"`).join(",")
        ),
      ].join("\n");

      res.send(csvContent);
    } else {
      res.json(bookings);
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      message: "Error exporting analytics data",
      error: error.message,
    });
  }
});

export default router;
