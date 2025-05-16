import VeridaService, { EventData } from "./verida-service";

// Extend VeridaService interfaces to match our needs
interface VeridaDateFilter {
  $gte?: string;
  $lte?: string;
  [key: string]: unknown;
}

export interface VeridaEventFilter {
  startDate?: VeridaDateFilter;
  endDate?: VeridaDateFilter;
  [key: string]: unknown;
}

interface VeridaEventResponse {
  items: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location?: string;
    description?: string;
  }>;
  total: number;
}

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

interface BookingRequest {
  donorId: string;
  hospitalId: string;
  preferredDates?: Date[];
  donationPurpose: string;
  duration: number; // in minutes
}

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  location?: string;
  description?: string;
}

interface BookingResponse {
  bookingId: string;
  status: 'confirmed' | 'pending' | 'failed';
  event: CalendarEvent;
}

interface DateFilter {
  $gte?: string;
  $lte?: string;
}

export interface EventFilter {
  startDate?: string | DateFilter;
  endDate?: string | DateFilter;
  [key: string]: unknown;
}

export interface CalendarResponse {
  items: CalendarEvent[];
  total: number;
}

// interface EventData {
//   id?: string;
//   title: string;
//   startDate: string;
//   endDate: string;
//   description?: string;
//   location?: string;
//   attendees: Attendee[];
//   sourceApplication?: string;
// }

export class BookingService {
  private veridaService: VeridaService;

  constructor() {
    this.veridaService = new VeridaService();
  }

  private async ensureToken() {
    // Try to get token from localStorage first
    const savedToken = localStorage.getItem('veridaToken');
    if (savedToken) {
      this.veridaService.setAuthToken(savedToken);
      return;
    }

    // If no token in localStorage, try to get from session API
    try {
      const response = await fetch('/api/fertility-ai/auth/verida/token');
      const data = await response.json();

      if (data.token) {
        this.veridaService.setAuthToken(data.token);
        localStorage.setItem('veridaToken', data.token);
      } else {
        throw new Error('No auth token available');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw new Error('Authentication required');
    }
  }

  /**
   * Get available slots based on donor's existing calendar
   */
  async getAvailableSlots(donorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    try {
      // Generate default time slots for the selected date
      const slots: TimeSlot[] = [];
      const currentDate = new Date(startDate);
      currentDate.setHours(9, 0, 0, 0); // Start at 9 AM

      // Generate slots every hour from 9 AM to 5 PM
      while (currentDate.getHours() < 17) { // 5 PM
        const slotStart = new Date(currentDate);
        const slotEnd = new Date(currentDate);
        slotEnd.setHours(currentDate.getHours() + 1);

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: true
        });

        currentDate.setHours(currentDate.getHours() + 1);
      }

      try {
        // Try to get booked slots from Verida calendar
        const bookedSlots = await this.getBookedSlots(donorId, startDate, endDate);

        // Mark slots as unavailable if they overlap with booked slots
        return slots.map(slot => ({
          ...slot,
          available: !bookedSlots.some(bookedSlot =>
            (slot.start >= bookedSlot.start && slot.start < bookedSlot.end) ||
            (slot.end > bookedSlot.start && slot.end <= bookedSlot.end)
          )
        }));
      } catch (error) {
        // If Verida calendar fetch fails, return default slots
        console.warn('Failed to fetch booked slots:', error);
        return slots;
      }
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error('Failed to retrieve available slots');
    }
  }

  private async getBookedSlots(donorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    // Try to fetch booked slots from Verida calendar
    // If it fails, return empty array
    try {
      const veridaService = new VeridaService();
      const events = await veridaService.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      return events.map(event => ({
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        available: false
      }));
    } catch (error) {
      console.warn('Failed to fetch booked slots from Verida:', error);
      return [];
    }
  }

  /**
   * Generate possible time slots for a date range
   * For example, 1-hour slots from 9am-5pm each day
   */
  private generatePossibleTimeSlots(startDate: Date, endDate: Date, slotDuration = 60): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      // Generate slots for business hours (9am-5pm)
      const dayStart = new Date(currentDate);
      dayStart.setHours(9, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(17, 0, 0, 0);

      let slotStart = new Date(dayStart);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);

        slots.push({
          start: new Date(slotStart),
          end: new Date(slotEnd),
          available: true
        });

        slotStart = new Date(slotEnd);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      currentDate.setHours(0, 0, 0, 0);
    }

    return slots;
  }

  /**
   * Book an appointment for a donor
   */
  async bookAppointment(request: BookingRequest, selectedSlot: TimeSlot): Promise<BookingResponse> {
    try {
      await this.ensureToken();

      const event = await this.veridaService.createEvent({
        title: `Fertility Donation - ${request.donationPurpose}`,
        startDate: selectedSlot.start.toISOString(),
        endDate: selectedSlot.end.toISOString(),
        description: `Donation appointment at ${request.hospitalId}`,
        location: request.hospitalId,
        attendees: [
          { id: request.donorId, role: 'user' },
          { id: request.hospitalId, role: 'hospital' }
        ],
        id: ""
      });

      return {
        status: 'confirmed',
        bookingId: event.id,
        event: {
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }
      };
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw new Error('Failed to book appointment');
    }
  }

  /**
   * Use AI to suggest optimal booking slots
   */
  async suggestOptimalBookingSlots(donorId: string, startDate: Date, endDate: Date): Promise<TimeSlot[]> {
    try {
      // Get all available slots
      const availableSlots = await this.getAvailableSlots(donorId, startDate, endDate);

      if (availableSlots.length === 0) {
        return [];
      }

      // Use Verida's LLM agent to suggest optimal slots
      const prompt = `
        I need to find the best time slots for a sperm donation appointment.
        The donor's ID is ${donorId}.
        I have these available time slots: ${JSON.stringify(availableSlots.map(slot => ({
        start: slot.start.toISOString(),
        end: slot.end.toISOString()
      })))}.
        
        Based on patterns in the donor's calendar and optimal times for sperm donation,
        what are the top 3 suggested time slots? Return only the time slots in JSON format.
      `;

      const aiResponse = await this.veridaService.sendLLMAgentPrompt(prompt);

      // Parse the suggested slots
      try {
        const suggestedSlots = JSON.parse(aiResponse.response);
        return suggestedSlots;
      } catch (parseError) {
        console.warn('Could not parse AI response:', parseError);
        return availableSlots.slice(0, 3);
      }

    } catch (error) {
      console.error('Error suggesting optimal booking slots:', error);
      // Fallback to regular available slots
      return this.getAvailableSlots(donorId, startDate, endDate);
    }
  }
}

export default BookingService;