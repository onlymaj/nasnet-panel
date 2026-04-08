/**
 * Rule Counter Visualization
 * Pattern components for displaying firewall rule counter statistics
 *
 * Exports:
 * - CounterCell: Main component with platform detection
 * - CounterCellDesktop: Desktop presenter
 * - CounterCellMobile: Mobile presenter
 * - useRuleCounterVisualization: Headless hook
 * - formatPackets: Utility function
 * - formatBytes: Re-exported from @nasnet/core/utils
 */

export {
  CounterCell,
  CounterCellDesktop,
  CounterCellMobile,
  type CounterCellProps,
} from './CounterCell';

export { formatBytes } from '@nasnet/core/utils';

export {
  useRuleCounterVisualization,
  formatPackets,
  type CounterData,
  type CounterRates,
  type UseRuleCounterVisualizationOptions,
  type RuleCounterVisualizationState,
} from './use-rule-counter-visualization';
