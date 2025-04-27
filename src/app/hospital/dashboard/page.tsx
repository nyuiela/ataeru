'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/app/contexts/use-auth';

// This component is shown when hospital is not verified
function VerificationRequired() {
  const { setIsHospitalVerified } = useAuth();
  
  const handleVerifyNow = () => {
    // This would normally be an API call or verification process
    // For demo purposes, we'll just set the verification status to true
    setIsHospitalVerified(true);
    localStorage.setItem('isHospitalVerified', 'true');
  };
  
  return (
    <div className="max-w-3xl mx-auto text-center py-16 px-4">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Required</h2>
      <p className="text-gray-600 mb-6">
        {`Your hospital account is currently pending verification. Once verified, 
        you'll be able to access all features and services.`}
      </p>
      <div className="bg-blue-50 rounded-xl p-6 mb-8 max-w-lg mx-auto">
        <h3 className="font-medium text-gray-900 mb-2">Verification Process:</h3>
        <ol className="text-left text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Our team is reviewing your submitted documents</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>We may contact you for additional information</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>{`Once approved, you'll receive a confirmation email`}</span>
          </li>
        </ol>
      </div>
      <div className="flex gap-4 justify-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Contact Support
        </button>
        <button 
          onClick={handleVerifyNow} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Verify Now (Demo)
        </button>
      </div>
    </div>
  );
}

export default function HospitalDashboard() {
  const { isOnboarded, userType, isHospitalVerified, setIsHospitalVerified } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not onboarded or not a hospital
  useEffect(() => {
    if (!isOnboarded || userType !== 'hospital') {
      router.push('/');
    }
    else {
      setIsHospitalVerified(true)
    }
  }, [isOnboarded, userType, router, setIsHospitalVerified]);

  // For demonstration purposes - this would normally come from a database
  const donorStats = {
    total: 125,
    active: 87,
    pending: 12,
    new: 8
  };

  const customerStats = {
    total: 310,
    active: 178,
    new: 24
  };

  const recentDonations = [
    { id: 'DON-2025-042', donor: 'John D.', date: 'April 24, 2025', status: 'Completed' },
    { id: 'DON-2025-041', donor: 'Michael R.', date: 'April 22, 2025', status: 'Processing' },
    { id: 'DON-2025-039', donor: 'Robert K.', date: 'April 20, 2025', status: 'Completed' },
    { id: 'DON-2025-038', donor: 'David S.', date: 'April 19, 2025', status: 'Completed' },
  ];

  const recentCustomers = [
    { id: 'CUS-2025-088', name: 'Sarah & James M.', date: 'April 23, 2025', treatment: 'IVF' },
    { id: 'CUS-2025-087', name: 'Lisa T.', date: 'April 22, 2025', treatment: 'Donor Sperm' },
    { id: 'CUS-2025-086', name: 'Rachel & Emma P.', date: 'April 21, 2025', treatment: 'Surrogacy' },
    { id: 'CUS-2025-084', name: 'Thomas B.', date: 'April 20, 2025', treatment: 'Donor Sperm' },
  ];

  // This would normally be a real function to add a new donor to the database
  const handleAddDonor = () => {
    alert('Open donor registration form');
  };

  if (!isHospitalVerified) {
    return (
      <div className="min-h-screen bg-white text-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow">
          <VerificationRequired />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Hospital Dashboard</h1>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Verified</span>
              <Image 
                src="/images/logo.svg" 
                alt="Hospital Logo" 
                width={40} 
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('donors')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'donors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Donors
            </button>
            <button 
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'customers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Customers
            </button>
            <button 
              onClick={() => setActiveTab('treatments')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'treatments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Treatments
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Settings
            </button>
          </div>
          
          {activeTab === 'dashboard' && (
            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Donors</h3>
                  <p className="text-2xl font-bold text-gray-900">{donorStats.total}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+{donorStats.new} new</span>
                    <span className="text-gray-500 ml-2">this week</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Active Donors</h3>
                  <p className="text-2xl font-bold text-gray-900">{donorStats.active}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-yellow-600 font-medium">{donorStats.pending} pending</span>
                    <span className="text-gray-500 ml-2">verification</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-600 font-medium">+{customerStats.new} new</span>
                    <span className="text-gray-500 ml-2">this month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Active Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{customerStats.active}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-blue-600 font-medium">{Math.round(customerStats.active/customerStats.total*100)}%</span>
                    <span className="text-gray-500 ml-2">activity rate</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Donations */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Recent Donations</h3>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentDonations.map(donation => (
                      <div key={donation.id} className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{donation.donor}</p>
                          <p className="text-sm text-gray-500">{donation.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            donation.status === 'Completed' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-yellow-100 text-yellow-600'
                          }`}>
                            {donation.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <button 
                      onClick={handleAddDonor}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add New Donor
                    </button>
                  </div>
                </div>
                
                {/* Recent Customers */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Recent Customers</h3>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentCustomers.map(customer => (
                      <div key={customer.id} className="px-6 py-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                            {customer.treatment}
                          </span>
                          <button className="text-gray-400 hover:text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add New Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600 mb-6">
                The {activeTab} management section is currently under development.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}