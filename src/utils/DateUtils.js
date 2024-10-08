import moment from "moment";

// Function to format timestamp to HH:mm
export function formatTimestampToHHmm(timestamp) {
  return moment(timestamp).format("HH:mm");
}

export function formatTimestamp(timestamp, format) {
  return moment(timestamp).format(format);
}
export function compareWithCurrentTime(timeFrom, timeTo) {
  if (
    moment().format() >= moment(timeFrom).format() &&
    moment().format() <= moment(timeTo).format()
  ) {
    return true;
  } else {
    return false;
  }
}
