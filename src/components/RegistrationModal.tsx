'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/use-auth';

export default function RegistrationModal() {
  const { isRegistrationModalOpen, closeRegistrationModal, completeOnboarding } = useAuth();
  const [selectedType, setSelectedType] = useState<'user' | 'hospital' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    documents: [] as File[],
  });
  const account = useAccount();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Complete onboarding process
    completeOnboarding(selectedType as 'user' | 'hospital');
    
    // Redirect to appropriate dashboard
    if (selectedType === 'user') {
      router.push('/ai/recommendations');
    } else if (selectedType === 'hospital') {
      router.push('/hospital/dashboard');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files || [])]
      }));
    }
  };

  if (!isRegistrationModalOpen) return null;

  if (!account.isConnected) {
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedType === 'user' ? 'Identity Documents' : 'Hospital Documents'}
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload {selectedType === 'user' ? 'ID proof, medical records' : 'license, certifications, permits'}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Register
            </button>
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