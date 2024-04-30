import moment from "moment";

// Function to format timestamp to HH:mm
export function formatTimestampToHHmm(timestamp) {
  return moment(timestamp).format("HH:mm");
}
export function compareWithCurrentTime(timeFrom, timeTo) {
  if (moment() >= timeFrom && moment() <= timeTo) {
    return true;
  } else {
    return false;
  }
}
