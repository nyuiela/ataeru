'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Package, 
  FileText, 
  Users, 
  User,
  Zap,
  DollarSign,
  Clock
} from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'appointment' | 'donation' | 'surrogacy' | 'treatment';
  title: string;
  date: string;
  location: string;
  status: 'completed' | 'upcoming' | 'cancelled' | 'in-progress';
  hospital: {
    name: string;
    imageUrl?: string;
  };
  transactionHash?: string;
  amount?: string;
  doctor?: string;
  notes?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'donations' | 'treatments' | 'surrogacy'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the history data from your backend
    // For now, we'll use mock data
    const fetchHistory = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHistory([
        {
          id: '1',
          type: 'appointment',
          title: 'Initial Fertility Consultation',
          date: '2023-11-15T10:00:00',
          location: 'Room 305, East Wing',
          status: 'completed',
          hospital: {
            name: 'LifeSpring Main Center',
            imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          },
          doctor: 'Dr. Sarah Johnson',
          notes: 'Initial assessment and discussion of treatment options.',
        },
        {
          id: '2',
          type: 'donation',
          title: 'Sperm Donation',
          date: '2023-10-28T14:30:00',
          location: 'Donor Room 2',
          status: 'completed',
          hospital: {
            name: 'CryoBank Facility',
            imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          },
          transactionHash: '0x3a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
          amount: '0.5 ETH',
        },
        {
          id: '3',
          type: 'treatment',
          title: 'IVF Procedure - Cycle 1',
          date: '2023-09-20T09:15:00',
          location: 'Procedure Room 4',
          status: 'completed',
          hospital: {
            name: 'LifeSpring Main Center',
            imageUrl: '/images/hospital-1.jpg',
          },
          doctor: 'Dr. Michael Chen',
          notes: 'First IVF cycle completed successfully. 8 eggs retrieved, 5 fertilized.',
        },
        {
          id: '4',
          type: 'appointment',
          title: 'Follow-up Consultation',
          date: '2023-12-05T11:30:00',
          location: 'Room 210, West Wing',
          status: 'upcoming',
          hospital: {
            name: 'LifeSpring Main Center',
            imageUrl: '/images/hospital-1.jpg',
          },
          doctor: 'Dr. Sarah Johnson',
        },
        {
          id: '5',
          type: 'treatment',
          title: 'Embryo Transfer',
          date: '2023-10-10T08:00:00',
          location: 'Procedure Room 2',
          status: 'completed',
          hospital: {
            name: 'LifeSpring Main Center',
            imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          },
          doctor: 'Dr. Michael Chen',
          notes: 'Two Grade A embryos transferred.',
        },
        {
          id: '6',
          type: 'surrogacy',
          title: 'Surrogacy Contract Signing',
          date: '2023-07-15T15:00:00',
          location: 'Conference Room A',
          status: 'completed',
          hospital: {
            name: 'LifeSpring Legal Department',
          },
          transactionHash: '0x9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
        },
        {
          id: '7',
          type: 'surrogacy',
          title: 'Surrogate Medical Screening',
          date: '2023-07-28T09:30:00',
          location: 'Examination Room 3',
          status: 'completed',
          hospital: {
            name: 'LifeSpring Main Center',
            imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          },
          doctor: 'Dr. Emma Rodriguez',
        },
        {
          id: '8',
          type: 'donation',
          title: 'Sperm Donation',
          date: '2023-08-15T11:00:00',
          location: 'Donor Room 1',
          status: 'completed',
          hospital: {
            name: 'CryoBank Facility',
            imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          },
          transactionHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
          amount: '0.5 ETH',
        },
      ]);
      setIsLoading(false);
    };

    fetchHistory();
  }, []);

  const filteredHistory = activeTab === 'all' 
    ? history 
    : history.filter(item => 
        activeTab === 'appointments' ? item.type === 'appointment' : 
        activeTab === 'donations' ? item.type === 'donation' : 
        activeTab === 'treatments' ? item.type === 'treatment' :
        item.type === 'surrogacy'
      );
  
  // Sort by date, most recent first
  filteredHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My History</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Link href="/dashboard" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('all')}
            className={`${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All History
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`${
              activeTab === 'appointments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('treatments')}
            className={`${
              activeTab === 'treatments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Treatments
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`${
              activeTab === 'donations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('surrogacy')}
            className={`${
              activeTab === 'surrogacy'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Surrogacy
          </button>
        </nav>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredHistory.map((item) => (
              <li key={item.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {item.hospital.imageUrl ? (
                          <Image
                            src={item.hospital.imageUrl}
                            alt={item.hospital.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-800 font-semibold">
                              {item.hospital.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-blue-600">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.hospital.name}</p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            item.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}
                      >
                        {item.status === 'completed' ? 'Completed' : 
                         item.status === 'upcoming' ? 'Upcoming' :
                         item.status === 'in-progress' ? 'In Progress' : 'Cancelled'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {item.type === 'appointment' && (
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {item.type === 'donation' && (
                          <Package className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {item.type === 'treatment' && (
                          <FileText className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        {item.type === 'surrogacy' && (
                          <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        )}
                        <span>
                          {item.location}
                        </span>
                      </p>
                      
                      {item.doctor && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <User className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {item.doctor}
                        </p>
                      )}

                      {item.transactionHash && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <Zap className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Tx: {item.transactionHash.substring(0, 6)}...{item.transactionHash.substring(item.transactionHash.length - 4)}
                        </p>
                      )}

                      {item.amount && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <DollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {item.amount}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <span>
                        {new Date(item.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(item.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="mt-1 bg-gray-50 p-2 rounded-md">
                        {item.notes}
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <Link
                      href={`/dashboard/history/${item.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500 text-lg">No history items found.</p>
        </div>
      )}
    </div>
  );
}
