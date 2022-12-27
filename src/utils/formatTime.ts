export function formatTime(time: string) {
    const timeArray = time.split(":");
    const hours = timeArray[0];
    const minutes = timeArray[1];

    if (hours && Number(hours) == 12) {
        return `${hours.replace("0", "")}:${minutes} pm`;
    }
    if (hours && Number(hours) == 24) {
        return `${hours.replace("0", "")}:${minutes} am`;
    }
    if (hours && Number(hours) < 13) {
        return `${hours.replace("0", "")}:${minutes} am`;
    }
    if (hours && Number(hours) >= 13) {
        return `${Number(hours) - 12}:${minutes} pm`;
    }
    return time;
}
