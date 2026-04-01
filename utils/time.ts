/**
 * Converts a string "HH:mm" to total minutes (ex.: "09:30" -> 570)
 */
export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/**
 * Converts the total minutes to the string format "HH:mm" (ex.: 570 -> "09:30")
 */
export const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * Generates an array of times with specific intervals.
 * By default, generates slots every 30 minutes ("00:00", "00:30", etc.)
 */
export const generateTimeOptions = (intervalMinutes: number = 30): string[] => {
  const totalSlots = (24 * 60) / intervalMinutes;
  return Array.from({ length: totalSlots }, (_, i) =>
    minutesToTime(i * intervalMinutes),
  );
};
