/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useTransactionModal } from '@/hooks/useTransactionModal';
import TransactionModal from '@/components/TransactionModal';
import { contractAddresses, entryPointABI, entryPointAddress, hospitalRequestABI } from '@/contract/web3';
import { useAccount, useReadContract } from 'wagmi';

enum DonorType {
  SPERM,
  EGG,
  SURROGATE
}

enum RequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
  COMPLETED
}

interface DonorRequestFormData {
  donorType: DonorType;
  rules: string;
  date: string;
  time: string;
  maxDonor: number;
  minAmount: number;
  maxAmount: number;
  description: string;
}


interface HospitalInfo {
  about: string;
  contact: string;
  email: string;
  hospitalAddress: string;
  location: string;
  witnessHash: string;
  requests: string;
  name: string;
}
export default function DonorRequestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<DonorRequestFormData>({
    donorType: DonorType.SPERM,
    rules: '',
    date: '',
    time: '',
    maxDonor: 1,
    minAmount: 0,
    maxAmount: 0,
    description: ''
  });
  const { address } = useAccount();
  const { data: hospitalInfo } = useReadContract({
    abi: entryPointABI,
    address: entryPointAddress as `0x${string}`,
    account: address,
    functionName: 'gethospitalinfo',
    args: [address],
  })
  console.log(hospitalInfo);

  const {
    openModal,
    modalProps,
  } = useTransactionModal({
    contractAddress: (hospitalInfo as HospitalInfo)?.requests as string,
    abi: hospitalRequestABI,
    onSuccess: (receipt) => {
      console.log('Donor request submitted successfully:', receipt);
      onClose();
    },
    onError: (error) => {
      console.error('Donor request submission failed:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert date and time to Unix timestamp
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    const timestamp = Math.floor(dateTime.getTime() / 1000);

    const args = [
      formData.donorType,
      formData.rules,
      timestamp,
      timestamp, // Using same timestamp for time
      formData.maxDonor,
      formData.minAmount,
      formData.maxAmount,
      RequestStatus.PENDING,
      formData.description
    ];

    openModal({
      title: 'Submit Donor Request',
      description: 'Creating a new donor request',
      functionName: 'makeADonorRequest',
      args,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create Donor Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Donor Type</label>
            <select
              value={formData.donorType}
              onChange={(e) => setFormData(prev => ({ ...prev, donorType: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={DonorType.SPERM}>Sperm Donor</option>
              <option value={DonorType.EGG}>Egg Donor</option>
              <option value={DonorType.SURROGATE}>Surrogate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rules & Requirements</label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
              placeholder="Enter rules and requirements for donors"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Donors</label>
            <input
              type="number"
              value={formData.maxDonor}
              onChange={(e) => setFormData(prev => ({ ...prev, maxDonor: Number(e.target.value) }))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount (ETH)</label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, minAmount: Number(e.target.value) }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Amount (ETH)</label>
              <input
                type="number"
                value={formData.maxAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: Number(e.target.value) }))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter additional details about the request"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>

        <TransactionModal {...modalProps} />
      </div>
    </div>
  );
} 