"use client"
import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  contractAddress: string;
  abi: any;
  functionName: string;
  args?: any;
  onSuccess?: (receipt) => void;
  onError?: (error: Error) => void;
}

type TransactionStatus = 'idle' | 'preparing' | 'confirming' | 'success' | 'error';

export default function TransactionModal({
  isOpen,
  onClose,
  title,
  description,
  contractAddress,
  abi,
  functionName,
  args = [],
  onSuccess,
  onError,
}: TransactionModalProps) {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { address } = useAccount();

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (writeError) {
      setStatus('error');
      setError(writeError.message);
      onError?.(writeError);
    }
  }, [writeError, onError]);

  useEffect(() => {
    if (isPending) {
      setStatus('preparing');
    } else if (isConfirming) {
      setStatus('confirming');
    } else if (isSuccess) {
      setStatus('success');
      // Get the transaction receipt to extract the registration ID
      const getReceipt = async () => {
        try {
          const receipt = await fetch(`/api/transaction/${hash}`).then(res => res.json());
          if (receipt.logs && receipt.logs[0]) {
            const id = receipt.logs[0].data;
            setRegistrationId(id);
          }
          onSuccess?.(receipt);
        } catch (err) {
          console.error('Error fetching transaction receipt:', err);
          onSuccess?.(hash);
        }
      };
      getReceipt();
    }
  }, [isPending, isConfirming, isSuccess, hash, onSuccess]);

  const handleTransaction = async () => {
    try {
      setStatus('preparing');
      setError(null);

      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args,
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
      onError?.(err instanceof Error ? err : new Error('An error occurred'));
    }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          {status === 'idle' && (
            <>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
              <div className="mt-6">
                <button
                  onClick={handleTransaction}
                  disabled={!address}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!address ? 'Connect Wallet' : 'Confirm Transaction'}
                </button>
              </div>
            </>
          )}

          {status === 'preparing' && (
            <div className="py-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Preparing transaction...</p>
            </div>
          )}

          {status === 'confirming' && (
            <div className="py-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Confirming transaction...</p>
              <p className="mt-1 text-xs text-gray-400">
                This may take a few moments
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-900">Transaction successful!</p>
              <p className="mt-1 text-xs text-gray-500">
                Transaction hash: {hash?.slice(0, 6)}...{hash?.slice(-4)}
              </p>
              {registrationId && (
                <p className="mt-2 text-sm text-gray-900">
                  Registration ID: {registrationId.slice(0, 6)}...{registrationId.slice(-4)}
                </p>
              )}
              <button
                onClick={onClose}
                className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-900">Transaction failed</p>
              <p className="mt-1 text-xs text-red-500">{error}</p>
              <div className="mt-4 flex justify-center space-x-3">
                <button
                  onClick={handleTransaction}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 