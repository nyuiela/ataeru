import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import VeridaService from './verida-service';
import { db } from '../../../../firebase.config';

interface DonorMetrics {
  preferredTimes?: string[];
  expectedCompensation?: number;
  previousDonations?: number;
  specialRequirements?: string[];
  medicalHistory?: string;
  preferredHospitals?: string[];
}

interface HospitalInfo {
  id: string;
  name: string;
  location: string;
  specialization: string[];
  compensationRates: {
    standard: number;
    premium?: number;
  };
  requirementsCriteria: string[];
}

interface InviteRequest {
  hospitalId: string;
  donorIds: string[];
  purpose: string;
  urgency: 'low' | 'medium' | 'high';
  compensationOffered?: number;
  additionalRequirements?: string[];
  proposedDateRanges?: Array<{
    start: Date;
    end: Date;
  }>;
}

interface SearchResult {
  content?: string;
  text?: string;
  message?: string;
  [key: string]: unknown;
}

interface SearchResponse {
  items: SearchResult[];
  total: number;
  page: number;
  results: string[];
}

interface VeridaProfile {
  email?: string;
  name?: string;
  avatar?: string;
  [key: string]: unknown;
}

interface VeridaProfiles {
  profiles: Record<string, VeridaProfile>;
}

export class InviteService {
  private veridaService: VeridaService;

  constructor() {
    this.veridaService = new VeridaService();
  }

  async getDonorMetrics(donorId: string): Promise<DonorMetrics> {
    try {
      // Get donor data from Firebase
      const donorRef = doc(db, 'donors', donorId);
      const donorDoc = await getDoc(donorRef);

      if (!donorDoc.exists()) {
        throw new Error(`Donor ${donorId} not found`);
      }

      const donorData = donorDoc.data();

      // Get donation history
      const donationsQuery = query(
        collection(db, 'donations'),
        where('donorId', '==', donorId)
      );
      const donationDocs = await getDocs(donationsQuery);

      // Use Verida to search for preferences
      const searchResults = await this.veridaService.universalSearch('donation preferences compensation requirements', {
        limit: 20
      });

      const extractedPreferences = this.extractPreferencesFromSearchResults({
        results: searchResults.items,
        total: searchResults.total,
        page: searchResults.page,
        items: []
      });

      return {
        preferredTimes: donorData.preferences?.preferredTimes || extractedPreferences.preferredTimes,
        expectedCompensation: donorData.preferences?.expectedCompensation || extractedPreferences.expectedCompensation,
        previousDonations: donationDocs.size,
        specialRequirements: donorData.preferences?.specialRequirements || extractedPreferences.specialRequirements,
        medicalHistory: donorData.medicalHistory || '',
        preferredHospitals: donorData.preferences?.preferredHospitals || extractedPreferences.preferredHospitals
      };
    } catch (error) {
      console.error('Error getting donor metrics:', error);
      return {};
    }
  }

  private extractPreferencesFromSearchResults(searchResults: SearchResponse): Partial<DonorMetrics> {
    const preferences: Partial<DonorMetrics> = {
      preferredTimes: [],
      specialRequirements: [],
      preferredHospitals: []
    };

    // If no search results, return empty preferences
    if (!searchResults || !searchResults.items || !Array.isArray(searchResults.items)) {
      return preferences;
    }

    // Process each search result
    searchResults.items.forEach((result: SearchResult) => {
      const content = result.content || result.text || result.message || '';

      // Extract preferred times (morning, afternoon, evening, specific hours)
      const timeRegex = /prefer(red)?\s+(morning|afternoon|evening|night|weekends|weekdays|[0-9]{1,2}(am|pm))/gi;
      const timeMatches = content.match(timeRegex);
      if (timeMatches) {
        preferences.preferredTimes = [
          ...(preferences.preferredTimes || []),
          ...timeMatches
        ];
      }

      // Extract expected compensation
      const compensationRegex = /(\$[0-9,]+|\$[0-9]+[k]|[0-9]+\s+dollars)/i;
      const compensationMatch = content.match(compensationRegex);
      if (compensationMatch) {
        const amount = compensationMatch[0].replace(/\$|,|\s+dollars/g, '');
        if (amount.endsWith('k')) {
          preferences.expectedCompensation = parseInt(amount.replace('k', '')) * 1000;
        } else {
          preferences.expectedCompensation = parseInt(amount);
        }
      }

      // Extract special requirements
      const requirementsRegex = /(require|need|want)\s+([^.!?]+)/gi;
      const requirementMatches = content.matchAll(requirementsRegex);
      for (const match of requirementMatches) {
        if (match[2]) {
          preferences.specialRequirements?.push(match[2].trim());
        }
      }

      // Extract preferred hospitals
      const hospitalRegex = /(prefer|like|want)\s+(hospital|clinic|center)\s+([^.!?]+)/gi;
      const hospitalMatches = content.matchAll(hospitalRegex);
      for (const match of hospitalMatches) {
        if (match[3]) {
          preferences.preferredHospitals?.push(match[3].trim());
        }
      }
    });

    // Remove duplicates
    preferences.preferredTimes = [...new Set(preferences.preferredTimes)];
    preferences.specialRequirements = [...new Set(preferences.specialRequirements)];
    preferences.preferredHospitals = [...new Set(preferences.preferredHospitals)];

    return preferences;
  }

  async getHospitalInfo(hospitalId: string): Promise<HospitalInfo> {
    try {
      const hospitalRef = doc(db, 'hospitals', hospitalId);
      const hospitalDoc = await getDoc(hospitalRef);

      if (!hospitalDoc.exists()) {
        throw new Error(`Hospital ${hospitalId} not found`);
      }

      const hospitalData = hospitalDoc.data();

      return {
        id: hospitalId,
        name: hospitalData.name,
        location: hospitalData.location,
        specialization: hospitalData.specializations || [],
        compensationRates: {
          standard: hospitalData.compensationRates?.standard || 0,
          premium: hospitalData.compensationRates?.premium
        },
        requirementsCriteria: hospitalData.requirements || []
      };
    } catch (error) {
      console.error('Error getting hospital info:', error);
      throw new Error('Failed to retrieve hospital information');
    }
  }

  async createPersonalizedInvites(request: InviteRequest): Promise<{
    success: boolean;
    invitations: Array<{ donorId: string; invitationId: string; content: string }>;
  }> {
    try {
      const results: { donorId: string; invitationId: string; content: string }[] = [];
      const hospitalInfo = await this.getHospitalInfo(request.hospitalId);

      for (const donorId of request.donorIds) {
        const donorMetrics = await this.getDonorMetrics(donorId);

        // Create LLM prompt and get response
        const invitePrompt = `
          Create a personalized donation invite for a fertility clinic.
          
          HOSPITAL INFORMATION:
          Name: ${hospitalInfo.name}
          Location: ${hospitalInfo.location}
          Specialization: ${hospitalInfo.specialization.join(', ')}
          Standard Compensation: $${hospitalInfo.compensationRates.standard}
          ${hospitalInfo.compensationRates.premium ? `Premium Compensation: $${hospitalInfo.compensationRates.premium}` : ''}
          Requirements: ${hospitalInfo.requirementsCriteria.join(', ')}
          
          DONOR PREFERENCES:
          Preferred Times: ${donorMetrics.preferredTimes?.join(', ') || 'Not specified'}
          Expected Compensation: ${donorMetrics.expectedCompensation ? `$${donorMetrics.expectedCompensation}` : 'Not specified'}
          Previous Donations: ${donorMetrics.previousDonations || 0}
          Special Requirements: ${donorMetrics.specialRequirements?.join(', ') || 'None'}
          
          INVITATION DETAILS:
          Purpose: ${request.purpose}
          Urgency: ${request.urgency}
          Compensation Offered: ${request.compensationOffered ? `$${request.compensationOffered}` : 'Standard rate'}
          Additional Requirements: ${request.additionalRequirements?.join(', ') || 'None'}
          
          INSTRUCTIONS:
          1. Create a warm, personalized invitation
          2. Reference any relevant preferences from the donor
          3. Highlight compensation details, especially if it meets/exceeds expectations
          4. Include clear next steps for scheduling
          5. Emphasize the importance of their contribution
          6. Keep it professional but friendly
          
          The invitation should be an email format with subject line and body.
        `;

        const aiResponse = await this.veridaService.sendLLMPrompt(invitePrompt);

        // Create invitation in Firebase
        const invitationRef = await addDoc(collection(db, 'invitations'), {
          hospitalId: request.hospitalId,
          donorId,
          content: aiResponse.response,
          status: 'pending',
          purpose: request.purpose,
          compensationOffered: request.compensationOffered || hospitalInfo.compensationRates.standard,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        results.push({
          donorId,
          invitationId: invitationRef.id,
          content: aiResponse.response
        });
      }

      return {
        success: true,
        invitations: results
      };
    } catch (error) {
      console.error('Error creating personalized invites:', error);
      throw new Error('Failed to create personalized invites');
    }
  }

  async sendInvitation(invitationId: string): Promise<{
    success: boolean;
    invitationId: string;
    sentTo: string;
    sentAt: Date;
  }> {
    try {
      const invitationRef = doc(db, 'invitations', invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error(`Invitation ${invitationId} not found`);
      }

      const invitation = invitationDoc.data();
      console.log(invitation)

      // Get donor's email from Verida
      const donorProfiles = await this.veridaService.getConnectionProfiles();

      const donorEmail = this.extractEmailFromProfiles(donorProfiles);

      if (!donorEmail) {
        throw new Error('Donor email not found in Verida profiles');
      }

      // Update invitation status
      await updateDoc(invitationRef, {
        status: 'sent',
        sentAt: new Date()
      });

      return {
        success: true,
        invitationId,
        sentTo: donorEmail,
        sentAt: new Date()
      };
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw new Error('Failed to send invitation');
    }
  }

  private extractEmailFromProfiles(profiles: VeridaProfiles): string | null {
    if (!profiles?.profiles) return null;

    for (const profileKey in profiles.profiles) {
      const profile = profiles.profiles[profileKey];
      if (profile.email) return profile.email;
    }

    return null;
  }
}

export default InviteService;