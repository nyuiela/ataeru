'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/use-auth';
import ContractButton from './contractButton';
import { contractAddresses, entryPointABI, entryPointAddress } from '@/contract/web3';
import web3 from 'web3';


export enum ReceiverType {
  SPERMRECEIVER,
  EGGRECEIVER,
  SURROGATERECEIVER
}

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  contact: string;
  about: string;
  witnessHash: string;
  receiverType: number;
  documents: File[];
}

export default function RegistrationModal() {
  const { isRegistrationModalOpen, closeRegistrationModal } = useAuth();
  const [selectedType, setSelectedType] = useState<'user' | 'hospital' | null>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    contact: '',
    about: '',
    receiverType: 0,
    witnessHash: '',
    documents: [] as File[],
  });
  const account = useAccount();


  const isRegistered = useReadContract({
    abi: entryPointABI,
    address: entryPointAddress as `0x${string}`,
    account: account.address,
    functionName: 'isregistered',
  })
  const userInfo = useReadContract({
    abi: entryPointABI,
    address: entryPointAddress as `0x${string}`,
    account: account.address,
    functionName: 'getUsernDonorInfo',
    args: [account.address],
  })
  // const userInfo = fetchUserInfo(account.address as `0x${string}`);
  console.log(userInfo.data);
  console.log(isRegistered.data);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const userArgs = [formData.name, formData.email, formData.address, web3.utils.padRight(`${formData.phone}`, 16), formData.about, web3.utils.padRight(`${formData.witnessHash}`, 32)]
  const hospitalArgs = [account.address, formData.name, formData.email, formData.address, formData.about, formData.phone, web3.utils.padRight(`${formData.witnessHash}`, 32)]

  // const handleRegister = async (formData: RegistrationFormData) => {
  //   try {
  //     // Validate phone number
  //     if (!/^\d{16}$/.test(formData.phone)) {
  //       throw new Error('Phone number must be exactly 16 digits');
  //     }

  //     // Validate witness hash
  //     const witnessHash = formData.witnessHash.startsWith('0x')
  //       ? formData.witnessHash
  //       : `0x${formData.witnessHash}`;

  //     if (witnessHash.length !== 66) {
  //       throw new Error('Witness hash must be 32 bytes (64 hex characters)');
  //     }

  //     // Prepare arguments based on registration type
  //     const args = selectedType === 'user'
  //       ? [
  //         formData.name,
  //         formData.email,
  //         formData.address,
  //         web3.utils.padRight(formData.phone, 16),
  //         formData.about,
  //         web3.utils.padRight(witnessHash, 32),
  //         formData.receiverType
  //       ]
  //       : [
  //         account.address, // _ha: address
  //         formData.name, // _name: string
  //         formData.email, // _email: string
  //         formData.address, // _location: string
  //         formData.about, // _about: string
  //         BigInt(formData.phone), // _contact: uint256
  //         witnessHash // _witnessHash: bytes32
  //       ];

  //     // Open transaction modal with appropriate function name
  //     // openModal({
  //     //   title: selectedType === 'user' ? 'Registering User' : 'Registering Hospital',
  //     //   functionName: selectedType === 'user' ? 'registerUser' : 'registerHospital',
  //     //   args,
  //     // });
  //   } catch (error) {
  //     console.error('Registration error:', error);
  //     // You might want to show an error message to the user here
  //   }
  // };

  if (!isRegistrationModalOpen) return null;

  if (isRegistrationModalOpen && !account.isConnected) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Please Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your wallet to proceed with registration.</p>
          <button
            onClick={closeRegistrationModal}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Select Account Type</h2>
            <button onClick={closeRegistrationModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedType('user')}
              className="rounded-xl hover:border-blue-500 transition-all text-left group overflow-hidden"
            >
              <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
                <Image
                  src="https://i.imgur.com/qXaBeHO.png"
                  alt="User Registration"
                  width={300}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-b-xl border border-t-0 border-gray-200 group-hover:border-blue-300">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Individual User</h3>
                <p className="text-gray-600 text-sm">
                  Access fertility services, find donors, or become a donor yourself.
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedType('hospital')}
              className="rounded-xl hover:border-blue-500 transition-all text-left group overflow-hidden"
            >
              <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden">
                <Image
                  src="https://i.imgur.com/IU8uOO8.png"
                  alt="Hospital Registration"
                  width={300}
                  height={225}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent"></div>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-b-xl border border-t-0 border-gray-200 group-hover:border-blue-300">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Medical Facility</h3>
                <p className="text-gray-600 text-sm">
                  Offer fertility services to patients and manage donor programs.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isRegistrationModalOpen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedType === 'user' ? 'User Registration' : 'Hospital Registration'}
            </h2>
            <button onClick={closeRegistrationModal} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            // handleRegister(formData);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedType === 'user' ? 'Full Name' : 'Facility Name'}
              </label>
              <input
                type="text"
                value={formData.name}
                placeholder={selectedType === 'user' ? "Enter your full name" : "Enter facility name"}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                placeholder="Enter email address"
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Witness Hash</label>
              <input
                type="text"
                value={formData.witnessHash}
                placeholder="witnesshash"
                onChange={(e) => setFormData(prev => ({ ...prev, witnessHash: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                placeholder="Enter phone number"
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Type</label>
              <select
                value={String(formData.receiverType)}
                onChange={(e) => setFormData(prev => ({ ...prev, receiverType: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={0}>Sperm Receiver</option>
                <option value={1}>Egg Receiver</option>
                <option value={2}>Surrogate Receiver</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder={selectedType === 'user' ? "Enter your address" : "Enter facility address"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                placeholder={selectedType === 'user' ? "A short desc about yourself" : "Enter facility address"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            {selectedType === 'hospital' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedType === 'hospital' ? 'Identity Documents' : 'Hospital Documents'}
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload {selectedType === 'hospital' ? 'license, certifications, permits' : 'ID proof, medical records'}
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <ContractButton
                contractAddress={contractAddresses.entryPointAddress as string}
                abi={entryPointABI}
                functionName={selectedType === 'user' ? 'registerUser' : 'registerHospital'}
                // args={[formData.name, formData.email, formData.address, web3.utils.padRight(`${formData.phone}`, 16), formData.about, web3.utils.padRight(`${formData.witnessHash}`, 32), formData.receiverType]}
                args={selectedType === 'user' ? userArgs : hospitalArgs}
                buttonText="Register"
                title="Register as a user or hospital"
                description="Register as a user or hospital to access fertility services"
              />
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }
}