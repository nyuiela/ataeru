"use client"
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'user' | 'hospital';
}

export default function RegistrationModal({ isOpen, onClose, userType }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    documents: [] as File[],
  });
  const [selectedType, setSelectedType] = useState<'user' | 'hospital' | null>(null);
  const account = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Form submitted:', { ...formData, type: selectedType });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(e.target.files || [])]
      }));
    }
  };

  if (!isOpen) return null;

  if (!account.isConnected) {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Please Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">You need to connect your wallet to proceed with registration.</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!selectedType) {
    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Select Registration Type</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setSelectedType('user')}
              className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <h3 className="font-bold text-lg mb-2">User Registration</h3>
              <p className="text-gray-600 text-sm">
                Register as an individual user to access fertility services and treatments.
              </p>
            </button>

            <button
              onClick={() => setSelectedType('hospital')}
              className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <h3 className="font-bold text-lg mb-2">Hospital Registration</h3>
              <p className="text-gray-600 text-sm">
                Register your medical facility to provide fertility services and treatments.
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedType === 'user' ? 'User Registration' : 'Hospital Registration'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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
              placeholder="Enter your phone number"
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
              placeholder="Enter your address"
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