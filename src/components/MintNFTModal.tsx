'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import ContractButton from './contractButton';
import { contractAddresses, healthDataNftABI } from '@/contract/web3';

interface MintNFTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HealthData {
  name: string;
  description: string;
  healthRecords: File[];
  type: 'treatment' | 'donation' | 'surrogacy';
  attributes: {
    name: string;
    value: string;
  }[];
}

export default function MintNFTModal({ isOpen, onClose }: MintNFTModalProps) {
  const { address } = useAccount();
  const [formData, setFormData] = useState<HealthData>({
    name: '',
    description: '',
    healthRecords: [],
    type: 'treatment',
    attributes: [
      { name: 'Date', value: new Date().toISOString().split('T')[0] },
      { name: 'Owner', value: address || '' }
    ]
  });
  const [, setUploadedFiles] = useState<string[]>([]);
  const [, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [metadataUrl, setMetadataUrl] = useState<string | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        healthRecords: [...prev.healthRecords, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data;
  };

  const handleUpload = async () => {
    if (formData.healthRecords.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = formData.healthRecords.map(file => uploadFile(file));
      const urls = await Promise.all(uploadPromises);
      setUploadedFiles(urls);
      return urls;
    } catch (error) {
      setUploadError('Failed to upload files. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { name: '', value: '' }]
    }));
  };

  const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const uploadMetadata = async (fileUrls: string[]) => {
    const metadata = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      attributes: formData.attributes,
      healthRecords: fileUrls,
      createdAt: new Date().toISOString(),
      owner: address
    };

    // Convert metadata to Blob
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });

    // Create a File object from the Blob
    const metadataFile = new File([metadataBlob], 'metadata.json', {
      type: 'application/json'
    });

    // Upload metadata to IPFS
    const metadataUrl = await uploadFile(metadataFile);
    return metadataUrl;
  };

  const handleMint = async () => {
    try {
      // Upload health record files first
      const fileUrls = await handleUpload();

      if (!fileUrls) {
        throw new Error('Failed to upload health records');
      }

      // Upload metadata JSON to IPFS
      const metadataUrl = await uploadMetadata(fileUrls);
      console.log(metadataUrl);
      setMetadataUrl(metadataUrl);
      // Prepare minting data with metadata URL
      const mintData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        attributes: [
          { key: 'metadataUrl', value: metadataUrl },
          { key: 'createdAt', value: new Date().toISOString() },
          { key: 'owner', value: address || '' }
        ]
      };

      return mintData;
    } catch (error) {
      console.error('Error preparing mint data:', error);
      throw error;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create Healthcare NFT</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NFT Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter a name for your NFT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your healthcare NFT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NFT Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as HealthData['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              required
            >
              <option value="treatment">Treatment Record</option>
              <option value="donation">Donation Certificate</option>
              <option value="surrogacy">Surrogacy Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Health Records</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload medical records, test results, or certificates (PDF, JPG, PNG)
            </p>
            {formData.healthRecords.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="mt-1 space-y-1">
                  {formData.healthRecords.map((file, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Attributes</label>
              <button
                type="button"
                onClick={addAttribute}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Attribute
              </button>
            </div>
            <div className="space-y-2">
              {formData.attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                    placeholder="Attribute name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              ))}
            </div>
          </div>

          {uploadError && (
            <div className="text-red-600 text-sm mt-2">
              {uploadError}
            </div>
          )}

          <div className="mt-4">
            <ContractButton
              contractAddress={contractAddresses.healthDataNftAddress}
              abi={healthDataNftABI}
              functionName="mint"
              args={[address, metadataUrl]}
              buttonText="Mint NFT"
              title="Mint Healthcare NFT"
              description="Create a new healthcare NFT with your health data"
              onBeforeMint={handleMint}
              disabled={!formData.name || !formData.description || !formData.type || formData.healthRecords.length === 0}
            />
          </div>
        </form>
      </div>
    </div>
  );
} 