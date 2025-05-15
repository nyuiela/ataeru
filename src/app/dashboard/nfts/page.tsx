'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import MintNFTModal from '@/components/MintNFTModal';
import SellNFTModal from '@/components/SellNFTModal';
import BuyNFTModal from '@/components/BuyNFTModal';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddresses, marketplaceABI } from '@/contract/web3';

interface NFTAsset {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'treatment' | 'donation' | 'surrogacy';
  status: 'active' | 'expired' | 'redeemed' | 'listed';
  expiryDate?: string;
  contractAddress: string;
  tokenId: string;
  price?: string;
  seller?: string;
  attributes: {
    name: string;
    value: string;
  }[];
}

interface NFTAssetWithURI {
  nftOwner: string;
  price: bigint;
  saleEpoch: bigint;
  setTimeStamp: bigint;
  sold: boolean;
  uri: string;
}

export default function NFTsPage() {
  const [nfts, setNfts] = useState<NFTAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'treatment' | 'donation' | 'surrogacy'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTAsset | null>(null);

  const { address } = useAccount();
  const { data: NftData } = useReadContract({
    address: contractAddresses.marketplaceAddress as `0x${string}`,
    abi: marketplaceABI,
    account: address as `0x${string}`,
    functionName: 'getNftDetails',
    args: [],
  });
  console.log(NftData);

  // const fetchNftDetails = useCallback(async (uri: string) => {
  //   const cid = uri.split('/').pop();
  //   console.log(cid);
  //   const nftDetails = await fetch(`/api/file?cid=${cid}`);
  //   console.log(await nftDetails.json());
  // }, []);
  useEffect(() => {
    setIsLoading(true);
    const fetchNftDetails = async (uri: string) => {
      const json = await fetch(uri);
      const data = await json.json();
      console.log(data);
      return data;
    };
    if (NftData && (NftData as NFTAssetWithURI[]).length > 0) {
      for (const nft of NftData as NFTAssetWithURI[]) {
        async function getDetails(uri: string) {
          const data = await fetchNftDetails(uri);
          setNfts(() => [{
            ...nft,
            id: "0",
            name: data.name,
            description: data.description,
            image: data.healthRecords[0],
            type: data.type,
            status: nft.sold ? "active" : "redeemed",
            price: nft.price.toString(),
            seller: nft.nftOwner,
            contractAddress: "0x0000000000000000000000000000000000000000",
            tokenId: "0",
            attributes: data.attributes,
          }]);
          setIsLoading(false);
        }
        getDetails(nft.uri);
      }
    }
  }, [NftData]);

  const filteredNfts = activeTab === 'all'
    ? nfts
    : nfts.filter(nft => nft.type === activeTab);

  const handleSellClick = (nft: NFTAsset) => {
    setSelectedNFT(nft);
    setShowSellModal(true);
  };

  const handleBuyClick = (nft: NFTAsset) => {
    setSelectedNFT(nft);
    setShowBuyModal(true);
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">NFT Marketplace</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <button
            onClick={() => setShowMintModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Create NFT
          </button>
          <button
            onClick={() => setShowSellModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mx-2"
          >
            Sell NFT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`${activeTab === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All NFTs
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`${activeTab === 'treatment'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Treatment Packages
          </button>
          <button
            onClick={() => setActiveTab('donation')}
            className={`${activeTab === 'donation'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Donation Certificates
          </button>
          <button
            onClick={() => setActiveTab('surrogacy')}
            className={`${activeTab === 'surrogacy'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Surrogacy Contracts
          </button>
        </nav>
      </div>

      {/* NFT Grid */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredNfts?.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNfts?.map((nft) => (
            <div key={nft.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative h-48">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${nft.status === 'active' ? 'bg-green-100 text-green-800' :
                        nft.status === 'expired' ? 'bg-red-100 text-red-800' :
                          nft.status === 'listed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {nft.status === 'active' ? 'Active' :
                      nft.status === 'expired' ? 'Expired' :
                        nft.status === 'listed' ? 'For Sale' : 'Redeemed'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{nft.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{nft.description}</p>

                {nft.price && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-lg font-semibold text-gray-900">
                      {nft.price} ETH
                    </p>
                    <p className="text-sm text-gray-500">
                      Listed by: {nft.seller}
                    </p>
                  </div>
                )}

                {nft.expiryDate && (
                  <p className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">Expires:</span> {new Date(nft.expiryDate).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    {/* Contract: {nft.contractAddress.substring(0, 6)}...{nft.contractAddress.substring(nft.contractAddress.length - 4)} */}
                  </p>
                  <p className="text-xs text-gray-500">
                    Token ID: {nft.tokenId}
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Properties</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.map((attr, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded p-2">
                        <p className="text-xs text-blue-600 truncate">{attr.name}</p>
                        <p className="text-sm text-gray-500 font-medium truncate">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Link
                    href={`/dashboard/nfts/${nft.id}`}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                  {nft.status === 'listed' ? (
                    <button
                      onClick={() => handleBuyClick(nft)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Buy Now
                    </button>
                  ) : nft.status === 'active' && nft.seller === address ? (
                    <button
                      onClick={() => handleSellClick(nft)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      List for Sale
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500 text-lg">No NFTs found in this category.</p>
          <button
            onClick={() => setShowMintModal(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your First NFT
          </button>
        </div>
      )}
      <SellNFTModal
        isOpen={showSellModal}
        onClose={() => {
          setShowSellModal(false);
          setSelectedNFT(null);
        }}
        nftId={selectedNFT?.id || ''}
        nftDetails={selectedNFT!}
      />
      {/* Modals */}
      <MintNFTModal isOpen={showMintModal} onClose={() => setShowMintModal(false)} />
      {selectedNFT && (
        <>

          <BuyNFTModal
            isOpen={showBuyModal}
            onClose={() => {
              setShowBuyModal(false);
              setSelectedNFT(null);
            }}
            nftId={selectedNFT.id}
            price={selectedNFT.price || '0'}
            nftDetails={selectedNFT}
          />
        </>
      )}
    </div>
  );
}
