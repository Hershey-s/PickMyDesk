// Calendar utility functions for availability calendar

/**
 * Get calendar data for a specific month and year
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (0-11, where 0 = January)
 * @returns {Object} Calendar data with dates and layout
 */
export const getCalendarData = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // Start from Sunday of the week containing the first day
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const endDate = new Date(lastDay);
  // End on Saturday of the week containing the last day
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push({
      date: new Date(currentDate),
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: isToday(currentDate),
      isPast: isPast(currentDate),
      dateString: formatDateForAPI(currentDate)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    dates,
    monthName: getMonthName(month),
    year,
    month
  };
};

/**
 * Check if a date is today
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Check if a date is in the past
 * @param {Date} date 
 * @returns {boolean}
 */
export const isPast = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Format date for API calls (YYYY-MM-DD)
 * @param {Date} date 
 * @returns {string}
 */
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get month name from month number
 * @param {number} month - Month (0-11)
 * @returns {string}
 */
export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

/**
 * Generate time slots based on workspace availability
 * @param {Object} workspace - Workspace object with availability
 * @param {Date} selectedDate - Selected date
 * @returns {Array} Array of time slots
 */
export const generateTimeSlots = (workspace, selectedDate) => {
  if (!workspace.availability || !selectedDate) return [];
  
  const dayName = getDayName(selectedDate.getDay());
  const dayAvailability = workspace.availability[dayName];
  
  if (!dayAvailability || !dayAvailability.available) {
    return [];
  }
  
  const slots = [];
  const startTime = dayAvailability.start || '09:00';
  const endTime = dayAvailability.end || '18:00';
  
  // Generate hourly slots
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  for (let hour = start; hour < end; hour++) {
    const timeString = formatTime(hour);
    slots.push({
      time: timeString,
      hour: hour,
      available: true, // Will be updated based on bookings
      displayTime: formatDisplayTime(hour)
    });
  }
  
  return slots;
};

/**
 * Get day name from day number
 * @param {number} dayNumber - Day number (0 = Sunday)
 * @returns {string}
 */
export const getDayName = (dayNumber) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[dayNumber];
};

/**
 * Parse time string to hour number
 * @param {string} timeString - Time in HH:MM format
 * @returns {number}
 */
export const parseTime = (timeString) => {
  const [hours] = timeString.split(':');
  return parseInt(hours, 10);
};

/**
 * Format hour number to time string
 * @param {number} hour - Hour number
 * @returns {string}
 */
export const formatTime = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`;
};

/**
 * Format hour for display (12-hour format)
 * @param {number} hour - Hour number (24-hour format)
 * @returns {string}
 */
export const formatDisplayTime = (hour) => {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
};

/**
 * Check if a time slot conflicts with existing bookings
 * @param {Array} bookings - Array of existing bookings
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} time - Time string (HH:MM)
 * @returns {boolean}
 */
export const isTimeSlotBooked = (bookings, date, time) => {
  if (!bookings || bookings.length === 0) return false;
  
  return bookings.some(booking => {
    const bookingStart = new Date(`${booking.startDate}T${booking.startTime || '00:00'}`);
    const bookingEnd = new Date(`${booking.endDate}T${booking.endTime || '23:59'}`);
    const slotTime = new Date(`${date}T${time}`);
    
    return slotTime >= bookingStart && slotTime < bookingEnd;
  });
};
