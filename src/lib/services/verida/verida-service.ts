import axios from 'axios';

interface EventFilter {
  startDate?: string;
  endDate?: string;
  title?: string;
  [key: string]: unknown;
}

export interface Attendies {
  id: string;
  role: 'user' | 'hospital'
}

export interface EventData {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  attendees: Attendies[];
  [key: string]: unknown;
}

interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  [key: string]: unknown;
}

interface SearchOptions {
  limit?: number;
  offset?: number;
  types?: string[];
  [key: string]: unknown;
}

export class VeridaService {
  private baseUrl = 'https://api.verida.ai/api/rest/v1';
  private authToken: string | null = null;

  /**
   * Initialize the service with an auth token
   */
  constructor(authToken?: string) {
    if (authToken) {
      this.authToken = authToken;
    }
  }

  /**
   * Set the auth token for API requests
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Helper method to encode schema URLs in base64
   */
  private encodeSchemaUrl(schemaUrl: string): string {
    return Buffer.from(schemaUrl).toString('base64');
  }

  async init() {
    if (this.authToken) return;

    try {
      // First check localStorage
      const savedToken = localStorage.getItem('veridaToken');
      if (savedToken) {
        this.authToken = savedToken;
        return;
      }

      // Then check session API
      const response = await fetch('/api/fertility-ai/auth/verida/token');
      const data = await response.json();

      if (data.success && data.token) {
        this.authToken = data.token;
        // Also store in localStorage
        localStorage.setItem('veridaToken', data.token);
      } else {
        throw new Error('No auth token available');
      }
    } catch (error) {
      console.error('Error initializing Verida service:', error);
      throw new Error('Authentication required');
    }
  }

  /**
   * Generate an authentication URL for Verida
   */
  async generateAuthUrl(redirectUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/fertility-ai/auth/verida', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      return data.authUrl;
    } catch (error) {
      console.error('Error generating auth URL:', error);
      throw error;
    }
  }

  /**
   * Fetch user's calendar events
   */
  async getCalendarEvents(filter?: EventFilter): Promise<EventData[]> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const schemaUrl = 'https://common.schemas.verida.io/social/calendar/v0.1.0/schema.json';
    const schemaUrlEncoded = this.encodeSchemaUrl(schemaUrl);

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/ds/query/${schemaUrlEncoded}`,
        data: {
          query: filter || {},
          options: {
            sort: [{ date: "asc" }],
            limit: 100
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Fetch user's events
   */
  async getEvents(filter?: EventFilter): Promise<EventData[]> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = this.encodeSchemaUrl(schemaUrl);

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/ds/query/${schemaUrlEncoded}`,
        data: {
          query: filter || {},
          options: {
            sort: [{ startDate: "asc" }],
            limit: 100
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar event
   */
  async createEvent(eventData: EventData): Promise<EventData> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    const schemaUrl = 'https://common.schemas.verida.io/social/event/v0.1.0/schema.json';
    const schemaUrlEncoded = this.encodeSchemaUrl(schemaUrl);

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/ds/save/${schemaUrlEncoded}`,
        data: {
          document: {
            ...eventData,
            schema: schemaUrl
          }
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  /**
   * Get user's connection profiles (Google, Telegram, etc.)
   */
  async getConnectionProfiles(providerId?: string): Promise<any> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    try {
      const url = providerId
        ? `${this.baseUrl}/connections/profiles?providerId=${providerId}`
        : `${this.baseUrl}/connections/profiles`;

      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching connection profiles:', error);
      throw error;
    }
  }

  /**
   * Get connection sync status
   */
  async getConnectionStatus(providerId?: string): Promise<any> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    try {
      const url = providerId
        ? `${this.baseUrl}/connections/status?providerId=${providerId}`
        : `${this.baseUrl}/connections/status`;

      const response = await axios({
        method: 'GET',
        url,
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching connection status:', error);
      throw error;
    }
  }

  /**
   * Send an LLM prompt to Verida
   */
  async sendLLMPrompt(prompt: string, options: LLMOptions = {}): Promise<{
    response: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/llm/prompt`,
        data: {
          prompt,
          options
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error sending LLM prompt:', error);
      throw error;
    }
  }

  /**
   * Send an LLM agent prompt to Verida
   */
  async sendLLMAgentPrompt(prompt: string, options: LLMOptions = {}): Promise<{
    response: string;
    usage: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/llm/agent/prompt`,
        data: {
          prompt,
          options
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error sending LLM agent prompt:', error);
      throw error;
    }
  }

  /**
   * Search user's data
   */
  async universalSearch(query: string, options: SearchOptions = {}): Promise<{
    items: string[];
    total: number;
    page: number;
  }> {
    if (!this.authToken) {
      throw new Error('Authentication token is required');
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/search/universal`,
        data: {
          query,
          options
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error performing universal search:', error);
      throw error;
    }
  }
}

export default VeridaService;