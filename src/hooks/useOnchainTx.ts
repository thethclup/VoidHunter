import { useState, useCallback } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSendCalls } from 'wagmi';
import { Address, Hex } from 'viem';
import { DATA_SUFFIX } from '../lib/onchain/OnchainProvider';

export function useOnchainTx() {
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [callId, setCallId] = useState<string | null>(null);

  // EIP-5792 Batch calls support
  const { 
    sendCallsAsync, 
    isPending: isCallsPending,
  } = useSendCalls();

  // Fallback for EOA wallets without EIP-5792 support
  const { 
    sendTransactionAsync, 
    isPending: isTxPending,
  } = useSendTransaction();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  const isPending = isCallsPending || isTxPending || isTxConfirming;

  const executeTx = useCallback(async ({ to, value, data }: { to: Address, value?: bigint, data?: Hex }) => {
    setTxHash(null);
    setCallId(null);

    const safeValue = value || 0n;
    const safeData = data || '0x';

    try {
      // Try EIP-5792 first
      const id = await sendCallsAsync({
        calls: [
          {
            to,
            value: safeValue,
            data: safeData,
          }
        ],
        capabilities: {
          dataSuffix: {
            value: DATA_SUFFIX,
            optional: true,
          }
        }
      });
      console.log("EIP-5792 call submitted:", id);
      setCallId(id);
    } catch (err: any) {
      if (err?.message?.toLowerCase().includes('reject') || err?.code === 4001) {
        console.warn("User rejected the transaction.");
        return;
      }
      console.warn("EIP-5792 sendCalls failed, falling back to traditional sendTransaction...", err);
      try {
        // Fallback without manual concat as requested
        const hash = await sendTransactionAsync({
          to,
          value: safeValue,
          data: safeData,
        });
        console.log("Fallback transaction submitted:", hash);
        setTxHash(hash);
      } catch (fallbackErr) {
        console.error("Fallback sendTransaction failed:", fallbackErr);
      }
    }
  }, [sendCallsAsync, sendTransactionAsync]);

  return {
    executeTx,
    isPending,
    isConfirmed: callId ? true : isTxConfirmed,
    txHash,
    callId,
  };
}
