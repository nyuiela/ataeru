'use client';

// Type definitions
export interface Hospital {
  id: number;
  name: string;
  compensation: string;
  careType: string[];
  paymentTime: string;
  location: string;
  rating: number;
}

export interface UserPreferences {
  minCompensation: number;
  maxCompensation: number;
  careTypes: string[];
  paymentTimeValue: number;
  paymentTimeUnit: 'hours' | 'days' | 'weeks' | 'months';
}

// Chat API
export async function sendChatMessage(message: string, threadId?: string): Promise<{ response: string; threadId: string }> {
  try {
    const response = await fetch('/api/fertility-ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, threadId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Recommendations API
export async function getRecommendations(preferences: UserPreferences): Promise<Hospital[]> {
  try {
    const response = await fetch('/api/fertility-ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get recommendations');
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

// Invites API
export async function getDonationInvites(): Promise<{invites: Hospital[], careTypes: string[]}> {
  try {
    const response = await fetch('/api/fertility-ai/invites');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch donation invites');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching donation invites:', error);
    throw error;
  }
}

// Care types API
export async function getCareTypes(): Promise<string[]> {
  try {
    const response = await fetch('/api/fertility-ai/recommendations');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch care types');
    }

    const data = await response.json();
    return data.careTypes;
  } catch (error) {
    console.error('Error fetching care types:', error);
    throw error;
  }
}