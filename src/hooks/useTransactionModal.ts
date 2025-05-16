"use client"
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Abi } from 'viem';
import { TransactionReceipt } from 'viem';

interface UseTransactionModalProps {
  contractAddress: string;
  abi: any;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
}

export function useTransactionModal({
  contractAddress,
  abi,
  onSuccess,
  onError,
}: UseTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [args, setArgs] = useState<unknown[]>([]);
  const { address } = useAccount();

  const openModal = ({
    title,
    description,
    functionName,
    args = [],
  }: {
    title: string;
    description?: string;
    functionName: string;
    args?: unknown[];
  }) => {
    if (!address) {
      // You might want to trigger wallet connection here
      return
    }

    setTitle(title);
    setDescription(description || '');
    setFunctionName(functionName);
    setArgs(args);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setFunctionName('');
    setArgs([]);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    modalProps: {
      isOpen,
      onClose: closeModal,
      title,
      description,
      contractAddress,
      abi,
      functionName,
      args,
      onSuccess,
      onError,
    },
  };
} 