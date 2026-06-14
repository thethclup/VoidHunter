import { useState, useCallback } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSendCalls } from 'wagmi';
import { Address, Hex } from 'viem';
import { DATA_SUFFIX } from '../lib/onchain/OnchainProvider';

export function useOnchainTx() {
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [callId, setCallId] = useState<string | null>(null);

  // EIP-5792 Batch calls support
  const { 
    sendCalls, 
    isPending: isCallsPending,
  } = useSendCalls({
    mutation: {
      onSuccess: (id) => setCallId(id),
    }
  });

  // Fallback for EOA wallets without EIP-5792 support
  const { 
    sendTransaction, 
    isPending: isTxPending,
  } = useSendTransaction({
    mutation: {
      onSuccess: (hash) => setTxHash(hash),
    }
  });

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
      sendCalls({
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
    } catch (err) {
      console.warn("EIP-5792 sendCalls failed, falling back to traditional sendTransaction...", err);
      // Fallback without manual concat as requested
      sendTransaction({
        to,
        value: safeValue,
        data: safeData,
      });
    }
  }, [sendCalls, sendTransaction]);

  return {
    executeTx,
    isPending,
    isConfirmed: callId ? true : isTxConfirmed,
    txHash,
    callId,
  };
}
