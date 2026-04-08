/**
 * StatsCounter Component
 * Displays animated counter for interface statistics with BigInt support
 *
 * @description
 * Renders a labeled statistic counter with support for BigInt values (TX/RX bytes/packets).
 * Includes subtle opacity animation when values update. Technical data (bandwidth,
 * byte counts) displayed in monospace font for clarity.
 *
 * NAS-6.9: Implement Interface Traffic Statistics
 */

import { memo, useEffect, useState, useCallback } from 'react';
import { cn } from '@nasnet/ui/utils';
import { formatBytesBigInt } from '@nasnet/core/utils';

import type { StatsCounterProps } from './interface-stats-panel.types';


/**
 * Formats a large number with thousand separators
 * Extended version that handles BigInt values
 *
 * @param value - Number as BigInt
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted number string with commas
 */
function formatNumberBigInt(value: bigint, locale = 'en-US'): string {
  return value.toLocaleString(locale);
}

/**
 * StatsCounter Component
 *
 * Displays a single statistic with label and formatted value.
 * Supports BigInt values for large counters (TX/RX bytes/packets).
 * Provides subtle CSS animation on value updates.
 *
 * @example
 * ```tsx
 * <StatsCounter
 *   value="1234567890"
 *   label="TX Bytes"
 *   unit="bytes"
 * />
 * // Displays: "1.15 GB" with label "TX Bytes"
 *
 * <StatsCounter
 *   value="42000"
 *   label="Total Packets"
 *   unit="packets"
 * />
 * // Displays: "42,000" with label "Total Packets"
 * ```
 */
export const StatsCounter = memo(function StatsCounter({
  value,
  label,
  unit = 'bytes',
  className,
}: StatsCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  // Detect value changes and trigger animation
  useEffect(() => {
    if (value === displayValue) {
      return;
    }

    setIsUpdating(true);
    // Small delay to trigger CSS transition
    const timer = setTimeout(() => {
      setDisplayValue(value);
      setIsUpdating(false);
    }, 50);
    return () => clearTimeout(timer);
  }, [value, displayValue]);

  // Format the value based on unit type with memoized callback
  const getFormattedValue = useCallback((): string => {
    try {
      const bigIntValue = BigInt(displayValue);

      if (unit === 'bytes') {
        return formatBytesBigInt(bigIntValue);
      }
      if (unit === 'packets' || unit === 'count') {
        return formatNumberBigInt(bigIntValue);
      }
      return String(displayValue);
    } catch (err) {
      // Fallback if BigInt parsing fails
      console.error('Error formatting stats counter:', err);
      return String(displayValue);
    }
  }, [displayValue, unit]);

  const formattedValue = getFormattedValue();

  return (
    <div className={cn('gap-component-sm category-networking flex flex-col', className)}>
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
      <span
        className={cn(
          'text-foreground font-mono text-2xl font-semibold tabular-nums transition-opacity duration-150',
          isUpdating && 'opacity-70'
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {formattedValue}
      </span>
    </div>
  );
});

StatsCounter.displayName = 'StatsCounter';
