/**
 * Utility functions for consistent time formatting across the application
 */

/**
 * Format time string to display both 24hr and 12hr format with AM/PM
 * @param {string} timeString - Time in HH:MM format (24-hour)
 * @returns {string} - Formatted time string like "09:00 (9:00 AM)"
 */
export const formatTimeWithAMPM = (timeString) => {
  if (!timeString) return "";
  
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  const time24 = `${hours}:${minutes}`;
  const time12 = `${hour12}:${minutes} ${ampm}`;
  
  return `${time24} (${time12})`;
};

/**
 * Format hour number to display both 24hr and 12hr format with AM/PM
 * @param {number} hour - Hour number (0-23)
 * @returns {string} - Formatted time string like "09:00 (9:00 AM)"
 */
export const formatHourWithAMPM = (hour) => {
  const time24 = `${hour.toString().padStart(2, "0")}:00`;
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour >= 12 ? "PM" : "AM";
  const time12 = `${hour12}:00 ${ampm}`;
  
  return `${time24} (${time12})`;
};

/**
 * Generate time options for dropdowns with AM/PM indicators
 * @param {boolean} isEndTime - Whether this is for end time selection
 * @returns {Array} - Array of time options with value and label
 */
export const generateTimeOptionsWithAMPM = (isEndTime = false) => {
  const options = [];
  const startHour = isEndTime ? 1 : 0;
  const endHour = 23;

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time24 = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const time12 = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
      
      options.push({
        value: time24,
        label: `${time24} (${time12})`,
      });
    }
  }
  
  return options;
};

/**
 * Convert 24-hour time to 12-hour format only
 * @param {string} timeString - Time in HH:MM format (24-hour)
 * @returns {string} - 12-hour format like "9:00 AM"
 */
export const formatTo12Hour = (timeString) => {
  if (!timeString) return "";
  
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours, 10);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Convert 12-hour time to 24-hour format
 * @param {string} timeString - Time in "H:MM AM/PM" format
 * @returns {string} - 24-hour format like "09:00"
 */
export const formatTo24Hour = (timeString) => {
  if (!timeString) return "";
  
  const [time, ampm] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours, 10);
  
  if (ampm === 'AM' && hour24 === 12) {
    hour24 = 0;
  } else if (ampm === 'PM' && hour24 !== 12) {
    hour24 += 12;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes}`;
};
