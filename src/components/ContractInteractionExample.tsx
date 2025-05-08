import { useTransactionModal } from '@/hooks/useTransactionModal';
import TransactionModal from '@/components/TransactionModal';
import fixedOraclePriceABI from '@/contract/abi/fixedOraclePrice.json';

export default function ContractInteractionExample() {
  const {
    openModal,
    modalProps,
  } = useTransactionModal({
    contractAddress: process.env.NEXT_PUBLIC_FIXED_ORACLE_PRICE_ADDRESS || '',
    abi: fixedOraclePriceABI,
    onSuccess: (receipt) => {
      console.log('Transaction successful:', receipt);
      // Handle success (e.g., show notification, update UI)
    },
    onError: (error) => {
      console.error('Transaction failed:', error);
      // Handle error (e.g., show error notification)
    },
  });

  const handleSetPrice = () => {
    openModal({
      title: 'Set Price',
      description: 'Set a new price for the oracle. This will update the price immediately.',
      functionName: 'setPrice',
      args: [1000000], // Example price in wei
    });
  };

  return (
    <div>
      <button
        onClick={handleSetPrice}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Set Price
      </button>

      <TransactionModal {...modalProps} />
    </div>
  );
} 