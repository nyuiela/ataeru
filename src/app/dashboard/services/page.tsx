'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  description: string;
  category: 'treatment' | 'donation' | 'surrogacy' | 'consultation' | 'storage';
  price: number;
  currency: 'USD' | 'ETH';
  duration: string;
  imageUrl?: string;
  isActive: boolean;
  isTokenized: boolean;
  availableAppointments?: number;
  popularity: number; // 1-100 scale for popularity
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingService, setIsAddingService] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | Service['category']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newService, setNewService] = useState<Omit<Service, 'id' | 'popularity'>>({
    name: '',
    description: '',
    category: 'treatment',
    price: 0,
    currency: 'USD',
    duration: '',
    isActive: true,
    isTokenized: false,
  });

  useEffect(() => {
    // In a real app, you would fetch services from your backend
    // For now, we'll use mock data
    const fetchServices = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setServices([
        {
          id: '1',
          name: 'Standard IVF Treatment',
          description: 'Complete IVF treatment package including consultations, procedures, and basic testing.',
          category: 'treatment',
          price: 12500,
          currency: 'USD',
          duration: '8-10 weeks',
          imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: true,
          availableAppointments: 15,
          popularity: 92,
        },
        {
          id: '2',
          name: 'Premium Egg Freezing',
          description: 'Comprehensive egg freezing service with 5-year storage included.',
          category: 'storage',
          price: 8500,
          currency: 'USD',
          duration: '2-3 weeks',
          imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba7d4076?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: true,
          availableAppointments: 20,
          popularity: 78,
        },
        {
          id: '3',
          name: 'Fertility Consultation',
          description: 'Initial consultation with fertility specialist to discuss treatment options.',
          category: 'consultation',
          price: 350,
          currency: 'USD',
          duration: '1 hour',
          imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: false,
          availableAppointments: 32,
          popularity: 85,
        },
        {
          id: '4',
          name: 'Sperm Donation Program',
          description: 'Participate in our sperm donation program with blockchain verification and compensation.',
          category: 'donation',
          price: 0.5,
          currency: 'ETH',
          duration: 'Ongoing',
          imageUrl: 'https://images.unsplash.com/photo-1567427013953-88102117053a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: true,
          popularity: 74,
        },
        {
          id: '5',
          name: 'Surrogacy Matching Service',
          description: 'Full-service surrogacy matching with legal support and smart contract implementation.',
          category: 'surrogacy',
          price: 28500,
          currency: 'USD',
          duration: '12-18 months',
          imageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: false,
          isTokenized: true,
          popularity: 65,
        },
        {
          id: '6',
          name: 'Embryo Storage',
          description: 'Long-term cryogenic storage for embryos with blockchain verification.',
          category: 'storage',
          price: 1200,
          currency: 'USD',
          duration: '1 year',
          imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: false,
          popularity: 70,
        },
        {
          id: '7',
          name: 'Genetic Testing',
          description: 'Comprehensive genetic testing for embryos before implantation.',
          category: 'treatment',
          price: 4500,
          currency: 'USD',
          duration: '2-3 weeks',
          imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d17669c8447?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          isActive: true,
          isTokenized: false,
          availableAppointments: 12,
          popularity: 86,
        },
      ]);
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      setNewService({ ...newService, [name]: parseFloat(value) || 0 });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewService({ ...newService, [name]: checked });
  };

  const handleAddService = async () => {
    // In a real app, you would send this data to your backend
    // For now, we'll just add it to our local state
    
    const serviceId = Math.random().toString(36).substring(2, 11);
    
    const newServiceComplete: Service = {
      ...newService,
      id: serviceId,
      popularity: 50, // Default popularity for new services
    };
    
    setServices([newServiceComplete, ...services]);
    
    // Reset form
    setNewService({
      name: '',
      description: '',
      category: 'treatment',
      price: 0,
      currency: 'USD',
      duration: '',
      isActive: true,
      isTokenized: false,
    });
    
    setIsAddingService(false);
  };

  const toggleServiceActive = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  // Filter services based on category and search term
  const filteredServices = services.filter(service => {
    // Filter by category
    if (activeCategory !== 'all' && service.category !== activeCategory) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !service.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !service.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get count of services by category for the tab badges
  const getCategoryCount = (category: 'all' | Service['category']) => {
    if (category === 'all') return services.length;
    return services.filter(service => service.category === category).length;
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <button
            onClick={() => setIsAddingService(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Service
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-4 py-2 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            name="status-filter"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>All Statuses</option>
            <option>Active Only</option>
            <option>Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`${
              activeCategory === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            All
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-gray-100 text-gray-900">
              {getCategoryCount('all')}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('treatment')}
            className={`${
              activeCategory === 'treatment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Treatments
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {getCategoryCount('treatment')}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('consultation')}
            className={`${
              activeCategory === 'consultation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Consultations
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
              {getCategoryCount('consultation')}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('donation')}
            className={`${
              activeCategory === 'donation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Donation Programs
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
              {getCategoryCount('donation')}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('storage')}
            className={`${
              activeCategory === 'storage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Storage
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
              {getCategoryCount('storage')}
            </span>
          </button>
          <button
            onClick={() => setActiveCategory('surrogacy')}
            className={`${
              activeCategory === 'surrogacy'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            Surrogacy
            <span className="ml-2 py-0.5 px-2.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
              {getCategoryCount('surrogacy')}
            </span>
          </button>
        </div>
      </div>

      {/* Service List */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div key={service.id} className={`bg-white overflow-hidden shadow rounded-lg ${!service.isActive && 'opacity-60'}`}>
              {service.imageUrl && (
                <div className="relative h-48">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {service.isTokenized && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        NFT
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-semibold text-gray-900">
                      {service.currency === 'ETH' ? 'Ξ' : '$'}{service.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      {service.currency === 'ETH' ? 'ETH' : 'USD'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.duration}
                  </div>
                </div>
                
                {service.availableAppointments !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Available Slots</span>
                      <span className="font-medium">{service.availableAppointments}</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          service.availableAppointments > 10 ? 'bg-green-500' : 
                          service.availableAppointments > 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${Math.min(100, service.availableAppointments * 5)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center text-sm mb-4">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-gray-500">Popularity: </span>
                  <div className="ml-1 flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${service.popularity}%` }}></div>
                    </div>
                    <span className="font-medium text-gray-700">{service.popularity}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    onClick={() => toggleServiceActive(service.id)}
                    className={`inline-flex items-center px-3 py-2 border ${
                      service.isActive 
                        ? 'border-red-300 text-red-700 hover:bg-red-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                    } text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {service.isActive ? (
                      <>
                        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Deactivate
                      </>
                    ) : (
                      <>
                        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        Activate
                      </>
                    )}
                  </button>
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-12">
          <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">No services found.</p>
          <button
            onClick={() => setIsAddingService(true)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Your First Service
          </button>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddingService && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New Service</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete the form below to add a new service to your catalog.
                  </p>
                </div>
                <form>
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={newService.name}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={newService.description}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        id="category"
                        value={newService.category}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="treatment">Treatment</option>
                        <option value="consultation">Consultation</option>
                        <option value="donation">Donation Program</option>
                        <option value="storage">Storage</option>
                        <option value="surrogacy">Surrogacy</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        id="duration"
                        value={newService.duration}
                        onChange={handleInputChange}
                        placeholder="e.g. 2-3 weeks, 1 hour"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={newService.price}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                      <select
                        name="currency"
                        id="currency"
                        value={newService.currency}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="USD">USD</option>
                        <option value="ETH">ETH</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="isTokenized"
                            name="isTokenized"
                            type="checkbox"
                            checked={newService.isTokenized}
                            onChange={handleCheckboxChange}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="isTokenized" className="font-medium text-gray-700">Tokenize as NFT</label>
                          <p className="text-gray-500">Enable blockchain verification and allow clients to purchase this service as an NFT.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleAddService}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingService(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Service Statistics</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Overview of your service performance</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 py-5 sm:p-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Total Services</h4>
              <p className="text-2xl font-bold text-blue-900">{services.length}</p>
              <p className="text-sm text-blue-700 mt-1">Across {Object.keys(
                services.reduce((acc, service) => {
                  acc[service.category] = true;
                  return acc;
                }, {} as Record<string, boolean>)
              ).length} categories</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Active Services</h4>
              <p className="text-2xl font-bold text-green-900">{services.filter(s => s.isActive).length}</p>
              <p className="text-sm text-green-700 mt-1">{Math.round(services.filter(s => s.isActive).length / services.length * 100)}% of total</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-purple-800 mb-1">Tokenized Services</h4>
              <p className="text-2xl font-bold text-purple-900">{services.filter(s => s.isTokenized).length}</p>
              <p className="text-sm text-purple-700 mt-1">{Math.round(services.filter(s => s.isTokenized).length / services.length * 100)}% of total</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Available Appointments</h4>
              <p className="text-2xl font-bold text-yellow-900">
                {services.reduce((sum, service) => sum + (service.availableAppointments || 0), 0)}
              </p>
              <p className="text-sm text-yellow-700 mt-1">Across all services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">About Service Tokenization</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Services marked as &quot;Tokenized&quot; will be available as NFTs on the blockchain, allowing patients to purchase, transfer, or resell them.</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Tokenized services have tamper-proof pricing and descriptions</li>
                <li>Patients can verify service details and authenticity on the blockchain</li>
                <li>Enable patients to purchase services as gift cards for others</li>
                <li>Smart contract-managed escrow ensures service delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
