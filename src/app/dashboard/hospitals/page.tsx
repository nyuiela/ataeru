'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Hospital {
  id: string;
  name: string;
  location: string;
  rating: number;
  specialties: string[];
  imageUrl: string;
  isFavorite: boolean;
  reviews: number;
  verified: boolean;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState<string>('');

  useEffect(() => {
    // In a real app, you would fetch the list of hospitals from your backend
    // For now, we'll use mock data
    setHospitals([
      {
        id: '1',
        name: 'LifeSpring Main Center',
        location: 'New York, NY',
        rating: 4.8,
        specialties: ['IVF', 'Egg Freezing', 'Surrogacy'],
        imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isFavorite: true,
        reviews: 128,
        verified: true
      },
      {
        id: '2',
        name: 'CryoBank Facilities',
        location: 'Los Angeles, CA',
        rating: 4.5,
        specialties: ['Sperm Donation', 'Egg Donation', 'Cryopreservation'],
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isFavorite: true,
        reviews: 94,
        verified: true
      },
      {
        id: '3',
        name: 'Fertility Plus Clinic',
        location: 'Chicago, IL',
        rating: 4.3,
        specialties: ['IVF', 'Genetic Testing', 'Fertility Preservation'],
        imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isFavorite: true,
        reviews: 76,
        verified: false
      },
      {
        id: '4',
        name: 'NextGen Reproductive Center',
        location: 'Seattle, WA',
        rating: 4.6,
        specialties: ['Surrogacy', 'IUI', 'Fertility Testing'],
        imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        reviews: 62,
        verified: true
      },
      {
        id: '5',
        name: 'Genesis Fertility Institute',
        location: 'Boston, MA',
        rating: 4.7,
        specialties: ['IVF', 'ICSI', 'Egg Donation'],
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        isFavorite: false,
        reviews: 84,
        verified: true
      },
    ]);
  }, []);

  const toggleFavorite = (id: string) => {
    setHospitals(hospitals.map(hospital => 
      hospital.id === id 
        ? { ...hospital, isFavorite: !hospital.isFavorite } 
        : hospital
    ));
  };

  const filteredHospitals = hospitals.filter(hospital => {
    // Filter by favorites if needed
    if (favoriteOnly && !hospital.isFavorite) return false;
    
    // Filter by search term
    if (searchTerm && !hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !hospital.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by specialty
    if (specialty && !hospital.specialties.some(s => s.toLowerCase() === specialty.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get unique specialties for filter
  const allSpecialties = Array.from(
    new Set(hospitals.flatMap(hospital => hospital.specialties))
  ).sort();

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Fertility Clinics</h1>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Link href="/dashboard/hospitals/map" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            View Map
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or location"
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <select
              id="specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Specialties</option>
              {allSpecialties.map((specialty) => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="flex items-center">
              <input
                id="favoriteOnly"
                type="checkbox"
                checked={favoriteOnly}
                onChange={() => setFavoriteOnly(!favoriteOnly)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="favoriteOnly" className="ml-2 block text-sm text-gray-700">
                Show Favorites Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital List */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="relative h-48">
                <Image
                  src={hospital.imageUrl || "https://via.placeholder.com/400x200?text=Hospital+Image"}
                  alt={hospital.name}
                  fill
                  className="object-cover"
                />
                <button 
                  onClick={() => toggleFavorite(hospital.id)}
                  className="absolute top-2 right-2 h-8 w-8 bg-white bg-opacity-75 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                >
                  {hospital.isFavorite ? (
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{hospital.name}</h3>
                    <p className="text-sm text-gray-500">{hospital.location}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm font-medium text-gray-900">{hospital.rating.toFixed(1)}</span>
                    <span className="ml-1 text-sm text-gray-500">({hospital.reviews})</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {hospital.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {hospital.verified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Blockchain Verified
                    </div>
                  )}
                  <Link
                    href={`/dashboard/hospitals/${hospital.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    View Details
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="mt-4 text-gray-500 text-lg">No hospitals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
