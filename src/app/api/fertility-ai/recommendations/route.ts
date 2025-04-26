import { NextRequest, NextResponse } from 'next/server';

// Define care type options
const CARE_TYPES = [
  'Standard Screening',
  'Premium Care',
  'Extended Support',
  'Genetic Screening',
  'Counseling Support'
];

// Sample hospital data (would come from database in production)
const HOSPITALS_DATA = [
  { 
    id: 1, 
    name: 'Fertility First Clinic', 
    compensation: '$150-250', 
    careType: ['Premium Care', 'Standard Screening'],
    paymentTime: '7 days',
    location: 'New York, NY',
    rating: 4.5
  },
  { 
    id: 2, 
    name: 'NextGen Fertility Center', 
    compensation: '$300-400', 
    careType: ['Premium Care', 'Extended Support', 'Genetic Screening'],
    paymentTime: '14 days',
    location: 'Los Angeles, CA',
    rating: 4.8
  },
  { 
    id: 3, 
    name: 'Family Future Institute', 
    compensation: '$200-300', 
    careType: ['Standard Screening', 'Counseling Support'],
    paymentTime: '3 days',
    location: 'Chicago, IL',
    rating: 4.3
  },
  { 
    id: 4, 
    name: 'Genesis Fertility Specialists', 
    compensation: '$250-350', 
    careType: ['Premium Care', 'Genetic Screening'],
    paymentTime: '10 days',
    location: 'Miami, FL',
    rating: 4.6
  },
  { 
    id: 5, 
    name: 'Hope Fertility Network', 
    compensation: '$150-200', 
    careType: ['Standard Screening'],
    paymentTime: '1 day',
    location: 'Dallas, TX',
    rating: 4.2
  },
  { 
    id: 6, 
    name: 'Advanced Reproductive Center', 
    compensation: '$350-450', 
    careType: ['Premium Care', 'Extended Support', 'Counseling Support', 'Genetic Screening'],
    paymentTime: '30 days',
    location: 'Seattle, WA',
    rating: 4.9
  }
];

// Interface for user preferences
interface UserPreferences {
  minCompensation: number;
  maxCompensation: number;
  careTypes: string[];
  paymentTimeValue: number;
  paymentTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
}

// Function to find recommendations based on preferences
function findRecommendations(preferences: UserPreferences) {
  const { minCompensation, maxCompensation, careTypes, paymentTimeValue, paymentTimeUnit } = preferences;
  
  // Convert payment time to days for comparison
  let maxPaymentDays = paymentTimeValue;
  switch(paymentTimeUnit) {
    case 'hours':
      maxPaymentDays = paymentTimeValue / 24;
      break;
    case 'weeks':
      maxPaymentDays = paymentTimeValue * 7;
      break;
    case 'months':
      maxPaymentDays = paymentTimeValue * 30;
      break;
  }
  
  // Filter hospitals based on preferences
  return HOSPITALS_DATA.filter(hospital => {
    // Extract min compensation from range (e.g., "$150-250" -> 150)
    const hospitalMinComp = parseInt(hospital.compensation.replace('$', '').split('-')[0]);
    const hospitalMaxComp = parseInt(hospital.compensation.replace('$', '').split('-')[1]);
    
    // Extract payment days (e.g., "7 days" -> 7)
    const hospitalPaymentDays = parseInt(hospital.paymentTime.split(' ')[0]);
    
    // Check if compensation ranges overlap
    const compensationMatches = hospitalMaxComp >= minCompensation && hospitalMinComp <= maxCompensation;
    
    // Check if payment time is within preference
    const paymentTimeMatches = hospitalPaymentDays <= maxPaymentDays;
    
    // Check if hospital has at least one of the requested care types
    const careTypesMatch = careTypes.length === 0 || 
      careTypes.some(care => hospital.careType.includes(care));
    
    return compensationMatches && paymentTimeMatches && careTypesMatch;
  })
  .sort((a, b) => {
    // Sort by match quality - first by care types match count, then by rating
    const aMatchCount = careTypes.filter(care => a.careType.includes(care)).length;
    const bMatchCount = careTypes.filter(care => b.careType.includes(care)).length;
    
    if (bMatchCount !== aMatchCount) {
      return bMatchCount - aMatchCount;
    }
    
    return b.rating - a.rating;
  });
}

// GET endpoint to get all available care types
export async function GET() {
  return NextResponse.json({ careTypes: CARE_TYPES });
}

// POST endpoint to get recommendations based on preferences
export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json() as UserPreferences;
    
    // Validate the preferences
    if (typeof preferences.minCompensation !== 'number' || 
        typeof preferences.maxCompensation !== 'number' || 
        !Array.isArray(preferences.careTypes) ||
        typeof preferences.paymentTimeValue !== 'number' ||
        !['hours', 'days', 'weeks', 'months'].includes(preferences.paymentTimeUnit)) {
      return NextResponse.json(
        { error: "Invalid preferences format" }, 
        { status: 400 }
      );
    }
    
    const recommendations = findRecommendations(preferences);
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Error processing recommendations request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}