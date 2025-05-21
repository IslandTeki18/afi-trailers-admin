/**
 * Checks if two date periods overlap
 */
export const arePeriodsOverlapping = (
  startA: Date,
  endA: Date,
  startB: Date,
  endB: Date
): boolean => {
  // Add time buffer to ensure clear definition of days
  const start1 = new Date(startA);
  start1.setHours(0, 0, 0, 0);

  const end1 = new Date(endA);
  end1.setHours(23, 59, 59, 999);

  const start2 = new Date(startB);
  start2.setHours(0, 0, 0, 0);

  const end2 = new Date(endB);
  end2.setHours(23, 59, 59, 999);

  return start1 <= end2 && start2 <= end1;
};
