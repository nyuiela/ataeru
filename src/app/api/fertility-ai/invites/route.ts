import { NextResponse } from 'next/server';

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

// GET endpoint to get all donation invites
export async function GET() {
  try {
    // Get unique care types across all hospitals
    const uniqueCareTypes = Array.from(
      new Set(HOSPITALS_DATA.flatMap(hospital => hospital.careType))
    );

    return NextResponse.json({ 
      invites: HOSPITALS_DATA,
      careTypes: uniqueCareTypes
    });
  } catch (error) {
    console.error("Error fetching donation invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation invites", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}