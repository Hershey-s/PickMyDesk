import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import axios from "axios";
import {
  getCalendarData,
  generateTimeSlots,
  isTimeSlotBooked,
  formatDateForAPI,
} from "../utils/calendar";

const AvailabilityCalendar = ({ workspace, onTimeSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5007";

  // Get calendar data for current month
  const calendarData = getCalendarData(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Fetch bookings for selected date
  const fetchBookings = async (date) => {
    if (!date || !workspace._id) return;

    setLoading(true);
    try {
      const dateStr = formatDateForAPI(date);
      const response = await axios.get(
        `${baseURL}/workspaces/${workspace._id}/availability?startDate=${dateStr}&endDate=${dateStr}`
      );

      // The API returns conflicting bookings, so we need to invert the logic
      setBookings(response.data.conflictingBookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots when date or workspace changes
  useEffect(() => {
    if (selectedDate && workspace) {
      const slots = generateTimeSlots(workspace, selectedDate);

      // Update availability based on bookings
      const updatedSlots = slots.map((slot) => ({
        ...slot,
        available: !isTimeSlotBooked(
          bookings,
          formatDateForAPI(selectedDate),
          slot.time
        ),
      }));

      setTimeSlots(updatedSlots);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, workspace, bookings]);

  // Fetch bookings when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookings(selectedDate);
    }
  }, [selectedDate, workspace._id]);

  const handleDateSelect = (dateObj) => {
    if (dateObj.isPast || !dateObj.isCurrentMonth) return;

    setSelectedDate(dateObj.date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (slot) => {
    if (!slot.available) return;

    setSelectedTime(slot);
    if (onTimeSelect) {
      onTimeSelect({
        date: selectedDate,
        time: slot.time,
        displayTime: slot.displayTime,
      });
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getDayClasses = (dateObj) => {
    let classes = "py-2 rounded-md text-sm cursor-pointer transition-colors ";

    if (!dateObj.isCurrentMonth) {
      classes += "text-gray-300 cursor-not-allowed ";
    } else if (dateObj.isPast) {
      classes += "text-gray-400 cursor-not-allowed ";
    } else if (
      selectedDate &&
      dateObj.date.toDateString() === selectedDate.toDateString()
    ) {
      classes += "bg-purple-100 text-purple-700 font-medium ";
    } else if (dateObj.isToday) {
      classes += "bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 ";
    } else {
      classes += "hover:bg-gray-100 ";
    }

    return classes;
  };

  const getTimeSlotClasses = (slot) => {
    let classes = "py-2 px-3 border rounded-md text-sm transition-colors ";

    if (!slot.available) {
      classes +=
        "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed ";
    } else if (selectedTime && selectedTime.time === slot.time) {
      classes += "bg-purple-100 border-purple-300 text-purple-700 ";
    } else {
      classes += "border-gray-200 hover:bg-gray-50 cursor-pointer ";
    }

    return classes;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Availability
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="mx-4 font-medium min-w-[120px] text-center">
            {calendarData.monthName} {calendarData.year}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center text-sm text-gray-500 font-medium py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar dates */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.dates.map((dateObj, index) => (
            <button
              key={index}
              className={getDayClasses(dateObj)}
              onClick={() => handleDateSelect(dateObj)}
              disabled={dateObj.isPast || !dateObj.isCurrentMonth}
            >
              {dateObj.day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Available time slots on {selectedDate.toLocaleDateString()}
          </h3>

          {loading ? (
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">
                Loading availability...
              </div>
            </div>
          ) : timeSlots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  className={getTimeSlotClasses(slot)}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  title={slot.available ? "Available" : "Already booked"}
                >
                  {slot.displayTime}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-sm text-gray-500">
                No available time slots for this date
              </div>
            </div>
          )}

          {selectedTime && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-700">
                Selected: {selectedDate.toLocaleDateString()} at{" "}
                {selectedTime.displayTime}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <div className="text-sm text-gray-500">
            Select a date to view available time slots
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
