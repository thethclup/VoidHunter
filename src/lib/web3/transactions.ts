import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
import { base } from 'viem/chains';
import { getAttributionData } from '../erc8021';

// Pseudo-contract logic for "Say GM" and "Record Run"
export const MOCK_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with real

export async function sendGMTransaction(walletClient: any, account: any) {
  try {
    const data = getAttributionData();
    console.log("Attaching ERC-8021 Data:", data);
    
    const address = typeof account === 'string' ? account : account?.address;
    
    // Simulate transaction on Base
    const hash = await walletClient.sendTransaction({
      account: address,
      to: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
      value: parseEther('0'),
      data: '0x' // Custom contract call or simple GM
    });
    return hash;
  } catch (err) {
    console.error("GM Failed", err);
    throw err;
  }
}

export async function recordRunOnChain(walletClient: any, account: any, depth: number, essence: number) {
  try {
    const data = getAttributionData();
    console.log("Attaching ERC-8021 Data to Record Run:", data, "Depth:", depth, "Essence:", essence);
    
    const address = typeof account === 'string' ? account : account?.address;
    
    const hash = await walletClient.sendTransaction({
      account: address,
      to: address,
      value: parseEther('0'),
      data: '0x' // Custom data
    });
    return hash;
  } catch (err) {
    console.error("Record failed", err);
    throw err;
  }
}
