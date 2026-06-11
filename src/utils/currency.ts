/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unified Currency Utility for Indian Rupee (INR) Conversions.
 */

export const EXCHANGE_RATE = 83;

/**
 * Calculates the INR cost from a USD price.
 */
export function convertToINR(usdAmount: number): number {
  return Math.ceil(usdAmount * EXCHANGE_RATE);
}

/**
 * Formats a USD amount as an Indian Rupee (INR) cost string.
 * Example: 149.99 USD -> ₹12,450
 */
export function formatPrice(usdAmount: number): string {
  const inrAmount = convertToINR(usdAmount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(inrAmount);
}
