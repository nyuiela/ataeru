import { useState } from 'react';
import VeridaService from './verida-service';

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

interface DonorPreferencesResult {
  preferredTimes?: string[];
  expectedCompensation?: number;
  specialRequirements?: string[];
  preferredHospitals?: string[];
  medicalRestrictions?: string[];
  success: boolean;
  error?: string;
}

interface InviteGenerationResult {
  content: string;
  subject: string;
  success: boolean;
  error?: string;
}

interface ScheduleRecommendationResult {
  suggestedSlots: Array<{
    date: string;
    startTime: string;
    endTime: string;
    confidence: number;
  }>;
  reason: string;
  success: boolean;
  error?: string;
}

interface VeridaError extends Error {
  code?: string;
  details?: unknown;
}

/**
 * Hook for interacting with Verida LLM agents to generate personalized content
 */
export const useVeridaLLM = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create an instance of VeridaService
  const veridaService = new VeridaService();

  /**
   * Extract donor preferences from their personal data (emails, messages, etc.)
   */
  const extractDonorPreferences = async (): Promise<DonorPreferencesResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a prompt for the LLM to extract preferences
      const prompt = `
        Based on all the data you can access from my emails, messages, calendar, and other sources,
        please extract my preferences related to sperm donation:
        
        1. Preferred times for appointments
        2. Expected compensation range
        3. Any special requirements or preferences
        4. Preferred hospitals or clinics
        5. Any medical restrictions or concerns
        
        Return only a JSON object with these fields:
        {
          "preferredTimes": ["morning", "weekends", etc.],
          "expectedCompensation": number in USD,
          "specialRequirements": ["privacy", "specific room type", etc.],
          "preferredHospitals": ["Hospital name", etc.],
          "medicalRestrictions": ["allergen", "condition", etc.]
        }
      `;
      
      // Use the agent prompt to analyze user data
      const response = await veridaService.sendLLMAgentPrompt(prompt, {
        temperature: 0.3,
        maxTokens: 500
      });
      
      // Parse the response
      try {
        const jsonResponse = JSON.parse(response.response);
        return {
          ...jsonResponse,
          success: true
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse LLM response as JSON');
      }
    } catch (err) {
      const error = err as VeridaError;
      setError(error.message || 'Failed to extract donor preferences');
      return {
        success: false,
        error: error.message || 'Failed to extract donor preferences'
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate a personalized invite for a donor based on their profile and preferences
   */
  const generatePersonalizedInvite = async (
    donorId: string,
    hospitalId: string,
    purpose: string,
    compensationOffered?: number,
    additionalRequirements?: string[]
  ): Promise<InviteGenerationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, try to get donor preferences
      let donorPreferences: DonorPreferencesResult | null = null;
      try {
        donorPreferences = await extractDonorPreferences();
      } catch (prefError) {
        console.warn('Failed to extract donor preferences:', prefError);
      }
      
      // Create a prompt for generating the invite
      const prompt = `
        Create a personalized invitation email for a sperm donor.
        
        DONOR INFORMATION:
        Donor ID: ${donorId}
        ${donorPreferences && donorPreferences.success ? `
        Preferred Times: ${donorPreferences.preferredTimes?.join(', ')}
        Expected Compensation: ${donorPreferences.expectedCompensation ? `$${donorPreferences.expectedCompensation}` : 'Unknown'}
        Special Requirements: ${donorPreferences.specialRequirements?.join(', ')}
        Preferred Hospitals: ${donorPreferences.preferredHospitals?.join(', ')}
        Medical Restrictions: ${donorPreferences.medicalRestrictions?.join(', ')}
        ` : 'No specific preferences known.'}
        
        HOSPITAL INFORMATION:
        Hospital ID: ${hospitalId}
        
        INVITATION DETAILS:
        Purpose: ${purpose}
        Compensation Offered: ${compensationOffered ? `$${compensationOffered}` : 'Standard rate'}
        Additional Requirements: ${additionalRequirements?.join(', ') || 'None'}
        
        INSTRUCTIONS:
        1. Create a warm, personalized email
        2. Include a compelling subject line
        3. Reference any relevant preferences if available
        4. Highlight compensation details, especially if it meets/exceeds expectations
        5. Include clear next steps for scheduling
        6. Emphasize the importance of their contribution
        7. Keep it professional but friendly
        
        Format your response as a JSON object with two fields:
        {
          "subject": "Your compelling subject line",
          "content": "The full body of the email"
        }
      `;
      
      // Use the regular LLM prompt for content generation
      const response = await veridaService.sendLLMPrompt(prompt, {
        temperature: 0.7,
        maxTokens: 1000
      });
      
      // Parse the response
      try {
        const jsonResponse = JSON.parse(response.response);
        return {
          ...jsonResponse,
          success: true
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return {
          subject: "Invitation to participate in our donation program",
          content: response.response,
          success: true
        };
      }
    } catch (err) {
      const error = err as VeridaError;
      setError(error.message || 'Failed to generate personalized invite');
      return {
        content: '',
        subject: '',
        success: false,
        error: error.message || 'Failed to generate personalized invite'
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get AI-recommended booking slots based on donor's calendar and preferences
   */
  const getRecommendedBookingSlots = async (
    donorId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ScheduleRecommendationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a prompt for the LLM to recommend slots
      const prompt = `
        I need recommendations for optimal sperm donation appointment slots.
        
        DONOR ID: ${donorId}
        DATE RANGE: ${startDate.toISOString()} to ${endDate.toISOString()}
        
        Based on the donor's calendar, personal patterns, and any preferences you can detect:
        1. What are the best 3 timeslots for scheduling a sperm donation appointment?
        2. Why are these slots optimal for this donor?
        
        Consider factors like:
        - Existing calendar events and patterns
        - Email or message indications of preferred times
        - Medical research showing optimal times for sperm donation
        - Travel patterns and commute times
        
        Format your response as a JSON object:
        {
          "suggestedSlots": [
            {
              "date": "YYYY-MM-DD",
              "startTime": "HH:MM",
              "endTime": "HH:MM",
              "confidence": 0.85 // From 0 to 1
            },
            ...
          ],
          "reason": "Explanation of why these slots are recommended"
        }
      `;
      
      // Use the agent prompt to analyze user calendar data
      const response = await veridaService.sendLLMAgentPrompt(prompt, {
        temperature: 0.4,
        maxTokens: 800
      });
      
      // Parse the response
      try {
        const jsonResponse = JSON.parse(response.response);
        return {
          ...jsonResponse,
          success: true
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Failed to parse LLM response as JSON');
      }
    } catch (err) {
      const error = err as VeridaError;
      setError(error.message || 'Failed to get recommended booking slots');
      return {
        suggestedSlots: [],
        reason: '',
        success: false,
        error: error.message || 'Failed to get recommended booking slots'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    extractDonorPreferences,
    generatePersonalizedInvite,
    getRecommendedBookingSlots
  };
};

export default useVeridaLLM;