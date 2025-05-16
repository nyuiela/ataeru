/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import ContractButton from './contractButton';
import { contractAddresses, marketplaceABI } from '@/contract/web3';
import Image from 'next/image';

interface BuyNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string;
  price: string;
  nftDetails?: {
    name: string;
    description: string;
    image: string;
    type: 'treatment' | 'donation' | 'surrogacy';
    attributes: {
      name: string;
      value: string;
    }[];
  };
}

export default function BuyNFTModal({ isOpen, onClose, nftId, price, nftDetails }: BuyNFTModalProps) {
  const [, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleBuy = async () => {
    try {
      setIsLoading(true);
      return {
        nftId,
        price
      };
    } catch (error) {
      console.error('Error preparing buy data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Purchase NFT</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {nftDetails && (
          <div className="mb-6">
            <div className="relative h-48 mb-4">
              <Image
                src={nftDetails.image}
                alt={nftDetails.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{nftDetails.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{nftDetails.description}</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">
                Price: {parseFloat(price) / 1e18} ETH
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <ContractButton
            contractAddress={contractAddresses.marketplaceAddress}
            abi={marketplaceABI}
            functionName="buy"
            args={[nftId]}
            buttonText="Purchase NFT"
            title="Purchase NFT"
            description="Complete the purchase of this NFT"
            onBeforeMint={handleBuy}
            value={price}
          />
        </div>
      </div>
    </div>
  );
} 