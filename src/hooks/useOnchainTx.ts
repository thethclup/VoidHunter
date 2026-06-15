import { useState, useCallback } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt, useSendCalls } from 'wagmi';
import { Address, Hex } from 'viem';
import { DATA_SUFFIX } from '../lib/onchain/OnchainProvider';

export function useOnchainTx() {
  const [txHash, setTxHash] = useState<Hex | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // EIP-5792 Batch calls support
  const { 
    sendCallsAsync 
  } = useSendCalls();

  // Fallback for EOA wallets without EIP-5792 support
  const { 
    sendTransactionAsync 
  } = useSendTransaction();

  const { isLoading: isTxConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  const isPending = isExecuting || isTxConfirming;

  const executeTx = useCallback(async ({ to, value, data }: { to: Address, value?: bigint, data?: Hex }) => {
    setTxHash(null);
    setCallId(null);
    setIsExecuting(true);

    const safeValue = value ?? 0n;
    const safeData = data || '0x';

    try {
      // Try EIP-5792 first with a 1.5s timeout. Some EOA wallets silently swallow wallet_sendCalls, 
      // preventing the fallback from executing.
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
      console.log("EIP-5792 call submitted:", id);
      setCallId(id);
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === 'UserRejectedRequestError') {
        console.warn("User rejected the initial transaction request.", err);
        setIsExecuting(false);
        return;
      }
      
      console.warn("EIP-5792 sendCalls failed or unsupported, falling back to traditional sendTransaction...", err?.message || err);
      
      try {
        const fallbackCallObject: any = {
          to,
          data: safeData,
          gas: 60000n, // Explicit gas limit to bypass eth_estimateGas failures for EOA-to-EOA data payloads
        };
        
        if (value && value > 0n) {
          fallbackCallObject.value = value;
        }

        const hash = await sendTransactionAsync(fallbackCallObject);
        console.log("Fallback transaction submitted:", hash);
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

  return {
    executeTx,
    isPending,
    isConfirmed: callId ? true : isTxConfirmed,
    txHash,
    callId,
  };
}
