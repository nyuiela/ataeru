'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import {
  Calendar,
  CreditCard,
  Heart,
  Image as ImageIcon,
  Clock,
  Package,
  CheckCircle
} from 'lucide-react';
import { contractAddresses } from '@/contract/web3';
import { hospitalRequestABI } from '@/contract/web3';

interface DashboardStats {
  consultations: number;
  donations: number;
  favoriteHospitals: number;
  nftsOwned: number;
}

// Define a type for activity items
interface ActivityItem {
  id: number;
  type: 'appointment' | 'donation' | 'nft';
  title: string;
  date: string;
  hospital?: string;
  transaction?: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

interface DonorRequest {
  donorType: number;
  rules: string;
  date: bigint;
  time: bigint;
  maxDonors: bigint;
  minAmontpayment: bigint;
  maxAmountPayment: bigint;
  status: number;
  requestDescription: string;
  isActive: boolean;
}

export default function Dashboard() {
  const { address } = useAccount();
  const [userType, setUserType] = useState<'user' | 'hospital' | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    consultations: 0,
    donations: 0,
    favoriteHospitals: 0,
    nftsOwned: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [donorRequests, setDonorRequests] = useState<DonorRequest[]>([]);
  const [currentId, setCurrentId] = useState<number>(1);

  // Fetch donor requests
  const { data: totalId } = useReadContract({
    address: contractAddresses.hospitalRequestContractAddress as `0x${string}`,
    abi: hospitalRequestABI,
    functionName: 'id',
  });

  const { data: currentRequest } = useReadContract({
    address: contractAddresses.hospitalRequestContractAddress as `0x${string}`,
    account: address as `0x${string}`,
    abi: hospitalRequestABI,
    functionName: 'getRequest',
    args: [currentId],
  });

  const { writeContract } = useWriteContract();

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    // For now, we'll set mock data
    const storedUserType = localStorage.getItem('userType') as 'user' | 'hospital' | null;
    setUserType(storedUserType || 'user');

    // Mock stats data
    setStats({
      consultations: 3,
      donations: userType === 'user' ? 2 : 0,
      favoriteHospitals: 4,
      nftsOwned: 2
    });

    // Mock recent activity
    setRecentActivity([
      {
        id: 1,
        type: 'appointment',
        title: 'Fertility Consultation',
        date: '2023-11-15',
        hospital: 'Ataeru Main Center',
        status: 'Completed'
      },
      {
        id: 2,
        type: 'donation',
        title: 'Sperm Donation',
        date: '2023-10-28',
        hospital: 'CryoBank Facility',
        status: 'Completed'
      },
      {
        id: 3,
        type: 'nft',
        title: 'Fertility Treatment Package NFT',
        date: '2023-10-05',
        transaction: '0x89e...3f2a',
        status: 'Active'
      }
    ]);

    if (currentRequest) {
      setDonorRequests(prev => [...prev, currentRequest as DonorRequest]);
      if (currentId < Number(totalId)) {
        setCurrentId(prev => prev + 1);
      }
    }
  }, [userType, currentRequest, totalId, currentId]);

  // Helper function to format timestamp
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  // Helper function to get donor type label
  const getDonorTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Sperm Donor';
      case 1: return 'Egg Donor';
      case 2: return 'Surrogate';
      default: return 'Unknown';
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await writeContract({
        address: contractAddresses.hospitalRequestContractAddress as `0x${string}`,
        abi: hospitalRequestABI,
        functionName: 'acceptRequest',
        args: [requestId],
      });
      // Refresh the requests list after accepting
      setDonorRequests([]);
      setCurrentId(1);
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          {userType === 'user' ? (
            <Link href="/forms/fertility-treatment" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Book Consultation
            </Link>
          ) : (
            <Link href="/dashboard/services" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Manage Services
            </Link>
          )}
        </div>
      </div>

      {/* Wallet info */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mt-6">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Connected Wallet</p>
            <p className="text-lg font-semibold text-gray-900">{address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Not connected'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Consultations */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Consultations</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.consultations}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/history" className="font-medium text-blue-600 hover:text-blue-500">View all</Link>
            </div>
          </div>
        </div>

        {/* Donations/Services */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {userType === 'user' ? 'Donations' : 'Services'}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.donations}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href={userType === 'user' ? "/dashboard/history" : "/dashboard/services"} className="font-medium text-blue-600 hover:text-blue-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Favorite Hospitals */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Favorite Hospitals</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.favoriteHospitals}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/hospitals" className="font-medium text-blue-600 hover:text-blue-500">View all</Link>
            </div>
          </div>
        </div>

        {/* NFTs */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">NFTs Owned</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.nftsOwned}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/nfts" className="font-medium text-blue-600 hover:text-blue-500">View all</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Donor Requests Section */}
      {userType === 'user' && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Donor Requests</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {donorRequests
                .filter(request => request.isActive && request.status === 0) // Only show active and pending requests
                .map((request, index) => (
                  <li key={index} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {getDonorTypeLabel(request.donorType)}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">{request.requestDescription}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Max Donors: {request.maxDonors.toString()}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Amount: {request.minAmontpayment.toString()} - {request.maxAmountPayment.toString()} ETH
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Date: {formatDate(request.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleAcceptRequest(index + 1)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              {donorRequests.filter(request => request.isActive && request.status === 0).length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                  No active donor requests available at the moment.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">{activity.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {activity.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {activity.type === 'appointment' && (
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {activity.type === 'donation' && (
                          <Package className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {activity.type === 'nft' && (
                          <ImageIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {activity.hospital || activity.transaction}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>
                        {new Date(activity.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
