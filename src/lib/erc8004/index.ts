/**
 * ERC-8004: Trustless Agents
 * Handling agent integration for on-chain verifiable behaviors.
 */

export interface TrustlessAgent {
  agentId: string;
  permissions: string[];
}

export function initializeAgent(): TrustlessAgent {
  return {
    agentId: "void-hunter-agent-0x1",
    permissions: ["SUBMIT_SCORE"]
  }
}
