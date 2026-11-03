import { useState, useCallback, useRef } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSendCalls } from 'wagmi';
import { Address, Hex } from 'viem';
import { DATA_SUFFIX } from '../lib/onchain/OnchainProvider';

export function useOnchainTx() {
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [confirmationDurationMs, setConfirmationDurationMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // EIP-5792 Batch calls support
  const { 
    sendCallsAsync 
  } = useSendCalls();

  // Fallback for EOA wallets without EIP-5792 support
  const { 
    sendTransactionAsync 
  } = useSendTransaction();

  // Polling receipt with 200ms intervals optimized for Base Denim 200ms native blocks
  const { 
    isLoading: isTxConfirming, 
    isSuccess: isTxConfirmed, 
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    pollingInterval: 200, // 200ms canonical blocks under Denim
  });

  const isPending = isExecuting || isTxConfirming;

  const executeTx = useCallback(async ({ to, value, data }: { to: Address, value?: bigint, data?: Hex }) => {
    setTxHash(null);
    setCallId(null);
    setConfirmationDurationMs(null);
    setIsExecuting(true);
    startTimeRef.current = performance.now();

    const safeValue = value ?? 0n;
    const safeData = data || '0x';

    try {
      // Try EIP-5792 first with a 1.5s timeout.
      const id = await Promise.race([
        sendCallsAsync({
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
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('TIMEOUT_EIP_5792_UNSUPPORTED')), 1500)
        )
      ]);
      console.log("Base Denim EIP-5792 call submitted:", id);
      setCallId(id);
      if (startTimeRef.current) {
        setConfirmationDurationMs(Math.round(performance.now() - startTimeRef.current));
      }
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === 'UserRejectedRequestError') {
        console.warn("User rejected the initial transaction request.", err);
        setIsExecuting(false);
        return;
      }
      
      console.warn("EIP-5792 sendCalls failed or unsupported, falling back to traditional sendTransaction...", err?.message || err);
      
      try {
        // Explicit gas limit bypassing eth_estimateGas and avoiding 'pending' block tag queries
        const fallbackCallObject: any = {
          to,
          data: safeData,
          gas: 60000n,
        };
        
        if (value && value > 0n) {
          fallbackCallObject.value = value;
        }

        const hash = await sendTransactionAsync(fallbackCallObject);
        console.log("Base Denim canonical transaction submitted:", hash);
        setTxHash(hash);
      } catch (fallbackErr: any) {
        console.error("Fallback sendTransaction failed:", fallbackErr);
        if (fallbackErr?.code === 4001 || fallbackErr?.name === 'UserRejectedRequestError') {
           console.warn("User rejected the fallback transaction request.");
        }
      }
    } finally {
      setIsExecuting(false);
    }
  }, [sendCallsAsync, sendTransactionAsync]);

  // Compute duration once confirmed
  if (isTxConfirmed && startTimeRef.current && confirmationDurationMs === null) {
    setConfirmationDurationMs(Math.round(performance.now() - startTimeRef.current));
  }

  return {
    executeTx,
    isPending,
    isConfirmed: callId ? true : isTxConfirmed,
    txHash,
    callId,
    receipt,
    confirmationDurationMs,
  };
}
