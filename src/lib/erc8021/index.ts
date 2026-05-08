/**
 * ERC-8021: Transaction Attribution
 * This standard allows attributing transactions to builders and clients.
 */

// Placeholder implementation for ERC-8021
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "bc_6qw3gmv5"; 

export function getAttributionData() {
  return {
    attributionCode: ATTRIBUTION_CODE,
    builderCode: BUILDER_CODE
  };
}
