import { useState, useCallback } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSendCalls } from 'wagmi';
import { concat, parseEther, Address, Hex } from 'viem';

// Encoded suffix for ERC-8021 builder code attribution
export const BUILDER_SUFFIX = '0x07626173656170700080218021802180218021802180218021' as Hex;

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
            value: BUILDER_SUFFIX,
            optional: true,
          }
        }
      });
    } catch (err) {
      // Fallback
      console.warn("EIP-5792 sendCalls failed, falling back to traditional sendTransaction...", err);
      const attributedData = safeData === '0x' ? BUILDER_SUFFIX : concat([safeData, BUILDER_SUFFIX]);
      sendTransaction({
        to,
        value: safeValue,
        data: attributedData,
      });
    }
  }, [sendCalls, sendTransaction]);

  return {
    executeTx,
    isPending,
    isConfirmed: callId ? true /* We assume calls are trackable if ID returned, otherwise tx confirmation */ : isTxConfirmed,
    txHash,
    callId,
  };
}
