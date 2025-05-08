import { useTransactionModal } from '@/hooks/useTransactionModal';
import TransactionModal from '@/components/TransactionModal';
import { useState } from 'react';

interface ContractButtonProps {
  contractAddress: string;
  abi: any;
  functionName: string;
  args: any[];
  buttonText: string;
  title: string;
  description: string;
  onBeforeMint?: () => Promise<any>;
  disabled?: boolean;
}

export default function ContractButton({
  contractAddress,
  abi,
  functionName,
  args,
  buttonText,
  title,
  description,
  onBeforeMint,
  disabled = false
}: ContractButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try {
      setIsLoading(true);
      if (onBeforeMint) {
        const result = await onBeforeMint();
        // Update args with the result if needed
        if (result) {
          args = [result.name, result.description, result.type, result.attributes];
        }
      }
      setIsOpen(true);
    } catch (error) {
      console.error('Error in before mint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        contractAddress={contractAddress}
        abi={abi}
        functionName={functionName}
        args={args}
        title={title}
        description={description}
      />
    </>
  );
} 