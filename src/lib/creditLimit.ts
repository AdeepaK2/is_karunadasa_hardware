/**
 * Credit Limit Configuration
 *
 * Rules:
 * - Maximum credit limit for any customer is Rs.100,000
 * - Alert is shown when customer attempts to exceed this limit
 * - System prevents credit purchases that would exceed the limit
 */

export const MAX_CREDIT_LIMIT = 100000;

/**
 * Check if a customer can make a credit purchase
 * @param currentBalance - Customer's current outstanding balance
 * @param newPurchaseAmount - Amount of the new purchase
 * @returns Object with canProceed flag and message
 */
export function checkCreditLimit(
  currentBalance: number,
  newPurchaseAmount: number
): { canProceed: boolean; message: string; newBalance: number } {
  const newBalance = currentBalance + newPurchaseAmount;

  if (newBalance > MAX_CREDIT_LIMIT) {
    const exceededAmount = newBalance - MAX_CREDIT_LIMIT;
    return {
      canProceed: false,
      message: `Credit limit exceeded! Customer would exceed the maximum credit limit of Rs.${MAX_CREDIT_LIMIT.toLocaleString()} by Rs.${exceededAmount.toLocaleString()}. Current balance: Rs.${currentBalance.toLocaleString()}, Purchase amount: Rs.${newPurchaseAmount.toLocaleString()}.`,
      newBalance,
    };
  }

  if (newBalance >= MAX_CREDIT_LIMIT * 0.9) {
    // Warning when approaching 90% of limit
    const remaining = MAX_CREDIT_LIMIT - newBalance;
    return {
      canProceed: true,
      message: `Warning: Customer is approaching credit limit. Remaining credit: Rs.${remaining.toLocaleString()}`,
      newBalance,
    };
  }

  return {
    canProceed: true,
    message: "",
    newBalance,
  };
}

/**
 * Get remaining credit available for a customer
 * @param currentBalance - Customer's current outstanding balance
 * @returns Remaining credit amount
 */
export function getRemainingCredit(currentBalance: number): number {
  return Math.max(0, MAX_CREDIT_LIMIT - currentBalance);
}

/**
 * Format credit limit warning message
 * @param currentBalance - Customer's current outstanding balance
 * @returns Formatted warning message
 */
export function getCreditLimitWarning(currentBalance: number): string | null {
  const percentage = (currentBalance / MAX_CREDIT_LIMIT) * 100;

  if (percentage >= 100) {
    return "⚠️ Credit limit reached!";
  } else if (percentage >= 90) {
    return "⚠️ Approaching credit limit!";
  } else if (percentage >= 75) {
    return "⚠️ High credit balance";
  }

  return null;
}
