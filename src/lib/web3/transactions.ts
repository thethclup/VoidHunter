import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
import { base } from 'viem/chains';
import { getAttributionData } from '../erc8021';

// Pseudo-contract logic for "Say GM" and "Record Run"
export const MOCK_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with real

export async function sayGMOnChain(walletClient: any, account: any) {
  try {
    const data = getAttributionData();
    console.log("Attaching ERC-8021 Data:", data);
    
    const address = typeof account === 'string' ? account : account?.address;
    
    // Simulate transaction on Base
    const hash = await walletClient.sendTransaction({
      account: address,
      to: address, // self send for demo
      value: parseEther('0'),
      data: '0x474d' // "GM" in hex
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
