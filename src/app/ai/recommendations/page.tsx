'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getRecommendations, getCareTypes, UserPreferences, Hospital } from '@/lib/services/fertility-ai';
import Header from '@/components/Header';
import { useAuth } from '@/app/contexts/use-auth';

// Define time unit options
const TIME_UNITS = ['hours', 'days', 'weeks', 'months'];

export default function RecommendationsPage() {
  const router = useRouter();
  const { isOnboarded, userType } = useAuth();
  
  // User preference state
  const [preferences, setPreferences] = useState<UserPreferences>({
    minCompensation: 150,
    maxCompensation: 350,
    careTypes: ['Standard Screening'],
    paymentTimeValue: 14,
    paymentTimeUnit: 'days',
  });

  // Recommendations state
  const [recommendations, setRecommendations] = useState<Hospital[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [careTypeOptions, setCareTypeOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated and has the correct user type
  useEffect(() => {
    if (!isOnboarded) {
      router.push('/'); // Redirect to homepage if not onboarded
      return;
    }
    
    if (userType !== 'user') {
      // If the user is a hospital, redirect them to hospital dashboard
      if (userType === 'hospital') {
        router.push('/hospital/dashboard');
      } else {
        router.push('/'); // Fallback to homepage for any other situation
      }
    }
  }, [isOnboarded, userType, router]);

  // Load care type options on page load
  useEffect(() => {
    const fetchCareTypes = async () => {
      try {
        const careTypes = await getCareTypes();
        setCareTypeOptions(careTypes);
      } catch (err) {
        console.error('Failed to fetch care types:', err);
        setCareTypeOptions([
          'Standard Screening',
          'Premium Care',
          'Extended Support',
          'Genetic Screening',
          'Counseling Support'
        ]);
      }
    };

    fetchCareTypes();
  }, []);

  // Load saved preferences from localStorage on first render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrefs = localStorage.getItem('fertilityAI_preferences');
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
          console.error('Failed to parse saved preferences', e);
        }
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fertilityAI_preferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  // Handle checkbox changes for care types
  const handleCareTypeChange = (careType: string) => {
    setPreferences(prev => {
      if (prev.careTypes.includes(careType)) {
        return { ...prev, careTypes: prev.careTypes.filter(t => t !== careType) };
      } else {
        return { ...prev, careTypes: [...prev.careTypes, careType] };
      }
    });
  };

  // Handle form submission and get recommendations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await getRecommendations(preferences);
      setRecommendations(results);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to fetch recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
       const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
       window.scrollTo({
          top: offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
       });
    }
  };

  // If not authenticated or wrong user type, don't render the main content
  if (!isOnboarded || userType !== 'user') {
    return null; // The useEffect will handle the redirect
  }

  return (
    <main className='mb-12'>
      <Header handleScrollToSection={handleScrollToSection} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Personalized Donation Recommendations</h1>
          <Link 
            href="/invites" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <span>View All Donation Invites</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preferences Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md scale-[0.8] -mt-12 border-3 border-blue-600">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Preferences</h2>
            <form onSubmit={handleSubmit}>
              {/* Compensation Range */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Compensation Range ($)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={preferences.minCompensation}
                    onChange={(e) => setPreferences({...preferences, minCompensation: parseInt(e.target.value)})}
                    className="w-24 border rounded px-3 py-2 text-gray-700"
                    min="50"
                    max={preferences.maxCompensation}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={preferences.maxCompensation}
                    onChange={(e) => setPreferences({...preferences, maxCompensation: parseInt(e.target.value)})}
                    className="w-24 border rounded px-3 py-2 text-gray-700"
                    min={preferences.minCompensation}
                    max="1000"
                  />
                </div>
              </div>

              {/* Care Types */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Care Types</label>
                <div className="space-y-2">
                  {careTypeOptions.map((careType) => (
                    <div key={careType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`care-${careType}`}
                        checked={preferences.careTypes.includes(careType)}
                        onChange={() => handleCareTypeChange(careType)}
                        className="mr-2 h-4 w-4 text-blue-600"
                      />
                      <label htmlFor={`care-${careType}`} className="text-gray-700">{careType}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Timeline */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Maximum Payment Time</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={preferences.paymentTimeValue}
                    onChange={(e) => setPreferences({...preferences, paymentTimeValue: parseInt(e.target.value)})}
                    className="w-24 border rounded px-3 py-2 text-gray-700"
                    min="1"
                  />
                  <select
                    value={preferences.paymentTimeUnit}
                    onChange={(e) => setPreferences({
                      ...preferences, 
                      paymentTimeUnit: e.target.value as 'hours' | 'days' | 'weeks' | 'months'
                    })}
                    className="border rounded px-3 py-2 text-gray-700"
                  >
                    {TIME_UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Finding Recommendations...' : 'Find Recommendations'}
              </button>
            </form>
          </div>

          {/* Recommendations Results */}
          <div className="md:col-span-2">
            {isLoading ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Finding Your Ideal Matches</h3>
                <p className="text-gray-600">This may take a moment...</p>
              </div>
            ) : !hasSearched ? (
              <div className="bg-blue-50 p-8 rounded-lg shadow-sm text-center">
                <svg className="w-16 h-16 mx-auto text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Enter Your Preferences</h3>
                <p className="text-gray-600">{`Adjust the preferences on the left and click "Find Recommendations" to see personalized donation opportunities.`}</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {recommendations.length} Recommended Opportunities
                </h2>
                {recommendations.map((hospital) => (
                  <div key={hospital.id} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-blue-700">{hospital.name}</h3>
                      <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium">{hospital.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-gray-600">
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span>Compensation: <strong className="text-green-600">{hospital.compensation}</strong></span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Payment in: <strong>{hospital.paymentTime}</strong></span>
                      </div>
                      
                      <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{hospital.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Care Options:</h4>
                      <div className="flex flex-wrap gap-2">
                        {hospital.careType.map(care => (
                          <span 
                            key={care}
                            className={`text-xs px-2 py-1 rounded-full ${
                              preferences.careTypes.includes(care)
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {care}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
                <p className="text-gray-600 mb-4">{`We couldn't find any donation opportunities matching your preferences.`}</p>
                <p className="text-gray-600">Try adjusting your preferences or:</p>
                <Link 
                  href="/invites"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Browse All Donation Invites
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}