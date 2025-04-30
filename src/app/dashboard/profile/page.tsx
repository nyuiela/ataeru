'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Info, CheckCircle } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  country: string;
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
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    medicalInfo: {
      bloodType: '',
      allergies: '',
      medicalConditions: '',
    },
    dataSharing: {
      shareWithAI: false,
      shareWithHospitals: false,
      shareForResearch: false,
    },
  });
  const [activeSection, setActiveSection] = useState<'personal' | 'medical' | 'sharing'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch user profile from the backend
    // For now, we'll use mock data
    setProfile({
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567',
      dateOfBirth: '1985-06-15',
      address: '123 Blockchain Street',
      city: 'Cryptoville',
      country: 'United States',
      medicalInfo: {
        bloodType: 'O+',
        allergies: 'None',
        medicalConditions: 'None',
      },
      dataSharing: {
        shareWithAI: true,
        shareWithHospitals: true,
        shareForResearch: false,
      },
    });
  }, []);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [section, field] = name.split('.');
    
    setProfile(prev => {
      const sectionKey = section as keyof typeof prev;
      return {
        ...prev,
        [section]: {
          ...(prev[sectionKey] as Record<string, unknown>),
          [field]: checked,
        },
      };
    });
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
                  {profile.name.split(' ').map(n => n[0]).join('')}
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
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={profile.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
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

          {activeSection === 'medical' && (
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="medicalInfo.bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                <select
                  name="medicalInfo.bloodType"
                  id="medicalInfo.bloodType"
                  value={profile.medicalInfo.bloodType}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="medicalInfo.allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                <textarea
                  name="medicalInfo.allergies"
                  id="medicalInfo.allergies"
                  rows={3}
                  value={profile.medicalInfo.allergies}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "List any allergies you have" : ""}
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="medicalInfo.medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <textarea
                  name="medicalInfo.medicalConditions"
                  id="medicalInfo.medicalConditions"
                  rows={3}
                  value={profile.medicalInfo.medicalConditions}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "List any medical conditions you have" : ""}
                  className={`mt-1 block w-full border ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              <div className="sm:col-span-2">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Medical Data Security</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Your medical information is encrypted and stored on a secure blockchain for privacy. You control who has access to this information.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sharing' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Manage how your data is shared within the LifeSpring ecosystem. Sharing your data can improve your experience and may provide compensation through our data sharing program.
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="dataSharing.shareWithAI"
                      name="dataSharing.shareWithAI"
                      type="checkbox"
                      checked={profile.dataSharing.shareWithAI}
                      onChange={handleCheckboxChange}
                      disabled={!isEditing}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="dataSharing.shareWithAI" className="font-medium text-gray-700">Share with FertilityAI Assistant</label>
                    <p className="text-gray-500">Allow our AI assistant to access your data to provide personalized recommendations and support.</p>
                    {profile.dataSharing.shareWithAI && (
                      <div className="mt-1 text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Earn 50 DATA tokens per month
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="dataSharing.shareWithHospitals"
                      name="dataSharing.shareWithHospitals"
                      type="checkbox"
                      checked={profile.dataSharing.shareWithHospitals}
                      onChange={handleCheckboxChange}
                      disabled={!isEditing}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="dataSharing.shareWithHospitals" className="font-medium text-gray-700">Share with Partner Hospitals</label>
                    <p className="text-gray-500">Allow partner hospitals to access your data for improved consultation and treatment planning.</p>
                    {profile.dataSharing.shareWithHospitals && (
                      <div className="mt-1 text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Priority appointments and 10% discount on services
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="dataSharing.shareForResearch"
                      name="dataSharing.shareForResearch"
                      type="checkbox"
                      checked={profile.dataSharing.shareForResearch}
                      onChange={handleCheckboxChange}
                      disabled={!isEditing}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="dataSharing.shareForResearch" className="font-medium text-gray-700">Share for Research</label>
                    <p className="text-gray-500">Allow anonymized data to be used for fertility research and technological advancements.</p>
                    {profile.dataSharing.shareForResearch && (
                      <div className="mt-1 text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Earn 100 DATA tokens per month
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Data Compensation Program</h3>
                <p className="mt-1 text-sm text-gray-500">
                  By participating in our data sharing program, you can earn DATA tokens that can be used for discounts on services or exchanged for cryptocurrency.
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">Your DATA token balance:</span>
                    <span className="font-bold text-blue-600">275 DATA</span>
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
