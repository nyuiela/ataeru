'use client';

import { useState, useEffect } from 'react';
import { Config, useAccount, useReadContract } from 'wagmi';
import { entryPointABI } from '@/contract/web3';
import { entryPointAddress } from '@/contract/web3';

interface UserInfoResponse {
  name: string;
  email: string;
  location: string;
  contact: string;
  about: string;
  userType: number;
  witnessHash: string;
  isRegistered: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
  about: string;
  medicalInfo: {
    bloodType: string;
    allergies: string;
    medicalConditions: string;
  };
  dataSharing: {
    shareWithAI: boolean;
    shareWithHospitals: boolean;
    shareForResearch: boolean;
  };
}

export default function ProfilePage() {
  const { address } = useAccount();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    about: '',

    medicalInfo: {
      bloodType: '',
      allergies: '',
      medicalConditions: '',
    },
    dataSharing: {
      shareWithAI: false,
      shareWithHospitals: false,
      shareForResearch: false,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const { data: userInfo } = useReadContract<typeof entryPointABI, 'getUserInfo', [], Config, { name: string; email: string; contact: string; location: string; about: string }>({
    address: entryPointAddress as `0x${string}`,
    account: address,
    abi: entryPointABI,
    functionName: 'getUserInfo',
    args: [],
  }) as { data: UserInfoResponse | undefined };

  useEffect(() => {
    console.log(userInfo);
    setProfile({
      name: userInfo?.name as string,
      email: userInfo?.email as string,
      phone: userInfo?.contact as string,
      dateOfBirth: 'classified',
      address: address as string,
      city: userInfo?.location as string,
      about: userInfo?.about as string,

    });
  }, [userInfo, address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => {
        const sectionKey = section as keyof typeof prev;
        return {
          ...prev,
          [section]: {
            ...(prev[sectionKey] as Record<string, unknown>),
            [field]: value,
          },
        };
      });
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    // In a real app, you would send the data to your backend
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsEditing(false);
    setIsSaving(false);
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                type="button"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your personal information and settings</p>
            </div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-800 font-semibold text-lg">
                  {profile?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 border-t border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveSection('personal')}
                className={`px-4 py-3 text-sm font-medium ${activeSection === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setActiveSection('medical')}
                className={`px-4 py-3 text-sm font-medium ${activeSection === 'medical' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Medical Info
              </button>
              <button
                onClick={() => setActiveSection('sharing')}
                className={`px-4 py-3 text-sm font-medium ${activeSection === 'sharing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Data Sharing
              </button>
            </nav>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {activeSection === 'personal' && (
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={profile.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  name="about"
                  id="about"
                  value={profile?.about}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border text-black ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div className="sm:col-span-2 pt-4 mt-2 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700">Connected Wallet Address</label>
                <div className="mt-1 flex items-center text-sm">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-mono">
                    {address ? `${address.substring(0, 8)}...${address.substring(address.length - 6)}` : 'No wallet connected'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
