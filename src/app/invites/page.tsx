'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDonationInvites, Hospital } from '@/lib/services/fertility-ai';

// Interface for sorting and filtering
interface FilterOptions {
  sortBy: 'compensation' | 'paymentTime' | 'rating';
  sortDirection: 'asc' | 'desc';
  careType: string | null;
  searchTerm: string;
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Hospital[]>([]);
  const [allInvites, setAllInvites] = useState<Hospital[]>([]);
  const [careTypes, setCareTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'rating',
    sortDirection: 'desc',
    careType: null,
    searchTerm: '',
  });

  // Fetch donation invites on page load
  useEffect(() => {
    const fetchInvites = async () => {
      try {
        setIsLoading(true);
        const data = await getDonationInvites();
        setAllInvites(data.invites);
        setCareTypes(data.careTypes);
        
        // Apply initial filters
        applyFilters(data.invites, filterOptions);
      } catch (err) {
        console.error('Error fetching donation invites:', err);
        setError('Failed to load donation invites. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvites();
  }, [filterOptions]);

  // Apply filters and sorting
  const applyFilters = (data: Hospital[], options: FilterOptions) => {
    let filteredInvites = [...data];
    
    // Apply care type filter if selected
    if (options.careType) {
      filteredInvites = filteredInvites.filter(invite => 
        invite.careType.includes(options.careType!)
      );
    }
    
    // Apply search term filter
    if (options.searchTerm) {
      const term = options.searchTerm.toLowerCase();
      filteredInvites = filteredInvites.filter(invite => 
        invite.name.toLowerCase().includes(term) || 
        invite.location.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filteredInvites.sort((a, b) => {
      let comparison = 0;
      
      if (options.sortBy === 'compensation') {
        // Extract min compensation from range (e.g., "$150-250" -> 150)
        const aVal = parseInt(a.compensation.replace('$', '').split('-')[0]);
        const bVal = parseInt(b.compensation.replace('$', '').split('-')[0]);
        comparison = aVal - bVal;
      } 
      else if (options.sortBy === 'paymentTime') {
        // Extract payment days (e.g., "7 days" -> 7)
        const aVal = parseInt(a.paymentTime.split(' ')[0]);
        const bVal = parseInt(b.paymentTime.split(' ')[0]);
        comparison = aVal - bVal;
      }
      else if (options.sortBy === 'rating') {
        comparison = a.rating - b.rating;
      }
      
      // Apply sort direction
      return options.sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setInvites(filteredInvites);
  };

  // Update filters when options change
  useEffect(() => {
    if (allInvites.length > 0) {
      applyFilters(allInvites, filterOptions);
    }
  }, [filterOptions, allInvites]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Donation Invites</h1>
          <p className="text-gray-600 mt-1">Browse all available sperm donation opportunities</p>
        </div>
        
        <Link 
          href="/ai/recommendations" 
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
        >
          <span>{`Can't decide? Get AI Recommendations`}</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Donation Invites</h3>
          <p className="text-gray-600">This may take a moment...</p>
        </div>
      ) : (
        <>
          {/* Filter and Sort Controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Search by name or location..."
                value={filterOptions.searchTerm}
                onChange={(e) => setFilterOptions({...filterOptions, searchTerm: e.target.value})}
              />
            </div>
            
            {/* Care Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filterOptions.careType || ''}
                onChange={(e) => setFilterOptions({
                  ...filterOptions, 
                  careType: e.target.value === '' ? null : e.target.value
                })}
              >
                <option value="">All Care Types</option>
                {careTypes.map(careType => (
                  <option key={careType} value={careType}>{careType}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex space-x-2">
                <select
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  value={filterOptions.sortBy}
                  onChange={(e) => setFilterOptions({
                    ...filterOptions, 
                    sortBy: e.target.value as 'compensation' | 'paymentTime' | 'rating'
                  })}
                >
                  <option value="rating">Rating</option>
                  <option value="compensation">Compensation</option>
                  <option value="paymentTime">Payment Time</option>
                </select>
                
                <button
                  className="border border-gray-300 rounded-md px-3 py-2"
                  onClick={() => setFilterOptions({
                    ...filterOptions, 
                    sortDirection: filterOptions.sortDirection === 'asc' ? 'desc' : 'asc'
                  })}
                >
                  {filterOptions.sortDirection === 'asc' ? (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Invites Grid */}
          {invites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invites.map((invite) => (
                <div key={invite.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-blue-600 px-4 py-3 text-white">
                    <h3 className="font-semibold">{invite.name}</h3>
                    <div className="flex items-center text-sm mt-1">
                      <svg className="w-4 h-4 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{invite.rating} • {invite.location}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between text-gray-700 mb-3">
                      <div>
                        <div className="text-sm font-medium">Compensation</div>
                        <div className="text-green-600 font-semibold">{invite.compensation}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">Payment In</div>
                        <div className="font-semibold">{invite.paymentTime}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Care Options:</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {invite.careType.map(care => (
                          <span 
                            key={`${invite.id}-${care}`}
                            className={`text-xs px-2 py-1 rounded-full ${
                              filterOptions.careType === care
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {care}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Invites Found</h3>
              <p className="text-gray-600 mb-4">{`We couldn't find any donation invites matching your filters.`}</p>
              <button 
                onClick={() => setFilterOptions({
                  sortBy: 'rating',
                  sortDirection: 'desc',
                  careType: null,
                  searchTerm: '',
                })}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}