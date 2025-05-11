import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import ContractButton from './contractButton';
import { contractAddresses, healthDataNftABI, marketplaceABI } from '@/contract/web3';
import Image from 'next/image';

interface SellNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftId: string;
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

export default function SellNFTModal({ isOpen, onClose, nftId, nftDetails }: SellNFTModalProps) {
  const { address } = useAccount();
  const [price, setPrice] = useState('');
  const [id, setNftId] = useState(nftId);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSell = async () => {
    try {
      setIsLoading(true);
      // Convert price to wei (assuming price is in ETH)
      const priceInWei = (parseFloat(price) * 1e18).toString();

      return {
        nftId,
        price: priceInWei
      };
    } catch (error) {
      console.error('Error preparing sell data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">List NFT for Sale</h2>
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
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleSell();
        }}>


          {!nftDetails && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NFT ID</label>
              <input
                type="number"
                value={id}
                onChange={(e) => setNftId(e.target.value)}
                placeholder="Enter NFT ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                step="0.001"
                min="0"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETH)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price in ETH"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              step="0.001"
              min="0"
              required
            />
          </div>

          <div className="mt-4">
            <ContractButton
              contractAddress={contractAddresses.marketplaceAddress}
              abi={marketplaceABI}
              functionName="sell"
              args={[id, price]}
              buttonText="List for Sale"
              title="List NFT for Sale"
              description="List your NFT on the marketplace"
              onBeforeMint={handleSell}
              disabled={!price || parseFloat(price) <= 0}
            />
          </div>
        </form>
      </div>
    </div>
  );
} 