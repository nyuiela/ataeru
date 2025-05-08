import { useTransactionModal } from '@/hooks/useTransactionModal';
import TransactionModal from '@/components/TransactionModal';

export default function ContractButton({ contractAddress, abi, functionName, args, buttonText, title, description }: { contractAddress: string, abi: any, functionName: string, args: any[], buttonText: string, title: string, description: string }) {
  const {
    openModal,
    modalProps,
  } = useTransactionModal({
    contractAddress: contractAddress,
    abi: abi,
    onSuccess: async (receipt) => {
      console.log('Transaction successful:', await receipt);

      // Add a delay to allow the transaction to be processed
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const event = await receipt.logs[0];
        if (event) {
          const id = event.data; // This will be the bytes32 ID
          console.log("ID: ", id);
          console.log('Registration ID:', id);
        }
      } catch (error) {
        console.error('Error processing transaction receipt:', error);
        // You might want to show a notification to the user here
      }

      // Handle success (e.g., show notification, update UI)
    },
    onError: async (error) => {
      console.error('Transaction failed:', error);
      // Handle error (e.g., show error notification)
    },
  });

  const handleSetPrice = () => {
    openModal({
      title,
      description,
      functionName,
      args,
    });
  };

  return (
    <div>
      <button
        onClick={handleSetPrice}
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {buttonText}
      </button>

      <TransactionModal {...modalProps} />
    </div>
  );
} 