/**
 * Loyalty Program Configuration and Utilities
 *
 * Program Rules:
 * - Customers earn 1 loyalty point for every Rs.100 spent
 * - Points are calculated based on the final total (after discounts and taxes)
 * - Points are automatically awarded upon successful transaction completion
 * - Points accumulate over time and are tracked per customer
 */

// Points earned per currency unit (Rs.100)
export const POINTS_PER_CURRENCY_UNIT = 100;

// Points value ratio (1 point per Rs.100)
export const POINTS_RATIO = 1;

/**
 * Calculate loyalty points based on purchase amount
 * @param totalAmount - The total purchase amount in Rs.
 * @returns Number of loyalty points earned (rounded down)
 */
export function calculateLoyaltyPoints(totalAmount: number): number {
  if (totalAmount < 0) return 0;
  return Math.floor(totalAmount / POINTS_PER_CURRENCY_UNIT) * POINTS_RATIO;
}

/**
 * Calculate how much more a customer needs to spend to earn the next point
 * @param totalAmount - The current purchase total in Rs.
 * @returns Amount needed to earn the next point
 */
export function amountToNextPoint(totalAmount: number): number {
  const remainder = totalAmount % POINTS_PER_CURRENCY_UNIT;
  return POINTS_PER_CURRENCY_UNIT - remainder;
}

/**
 * Format loyalty points message for display
 * @param points - Number of points
 * @returns Formatted message string
 */
export function formatPointsMessage(points: number): string {
  return points === 1 ? `${points} point` : `${points} points`;
}

/**
 * Calculate the monetary value of loyalty points
 * @param points - Number of loyalty points
 * @returns Monetary value in Rs.
 */
export function pointsToMonetaryValue(points: number): number {
  return points * POINTS_PER_CURRENCY_UNIT;
}
