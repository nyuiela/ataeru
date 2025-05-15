"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import BookingService from '@/lib/services/verida/booking-service';
import VeridaService from '@/lib/services/verida/verida-service';
import { cn, toPascalCase } from '@/lib/utils';

interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

interface DonorBookingFormProps {
  donorId: string;
  hospitalId: string;
  isAuthenticated: boolean;
}

const DonorBookingForm: React.FC<DonorBookingFormProps> = ({
  donorId,
  hospitalId,
  isAuthenticated,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [purpose, setPurpose] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [showConnectPrompt, setShowConnectPrompt] = useState(!isAuthenticated);
  
  const bookingServiceInstance = useMemo(() => new BookingService(), []);
  const veridaServiceInstance = useMemo(() => new VeridaService(), []);

  const fetchAvailableSlots = useCallback(async (date: Date) => {
    setIsLoading(true);
    try {
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const slots = await bookingServiceInstance.getAvailableSlots(donorId, date, endDate);
      setAvailableSlots(slots);
      
      if (slots.length > 0) {
        // Always show a recommendation for first available slot
        const firstAvailableSlot = slots.find(slot => slot.available);
        if (firstAvailableSlot) {
          setAiRecommendation(
            `Recommended time slot: ${format(firstAvailableSlot.start, 'h:mm a')} based on availability.`
          );
        }
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Show more user-friendly error
      toast.error('Notice', {
        description: 'Using default time slots as calendar data is not available.',
      });
      
      // Generate default slots
      const defaultSlots = generateDefaultTimeSlots(date);
      setAvailableSlots(defaultSlots);
    } finally {
      setIsLoading(false);
    }
  }, [donorId, bookingServiceInstance]);

  // Helper function to generate default time slots
  const generateDefaultTimeSlots = (date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);
      
      slots.push({
        start: slotStart,
        end: slotEnd,
        available: true
      });
    }
    
    return slots;
  };

  useEffect(() => {
    setShowConnectPrompt(!isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedDate && isAuthenticated) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, isAuthenticated, fetchAvailableSlots]);

  const connectToVerida = async () => {
    try {
      setIsLoading(true);
      const authUrl = await veridaServiceInstance.generateAuthUrl(window.location.origin + window.location.pathname);
      
      // Store the current path for redirect after auth
      localStorage.setItem('veridaAuthRedirect', window.location.pathname);
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Verida:', error);
      toast.error('Connection Failed', {
        description: 'Failed to connect to Verida. Please try again.',
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check for Verida token on mount
    const token = localStorage.getItem('veridaToken');
    if (!token && isAuthenticated) {
      setShowConnectPrompt(true);
    }
  }, [isAuthenticated]);

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      toast.error('Selection Required', {
        description: 'Please select a time slot',
      });
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Terms Required', {
        description: 'Please agree to the terms and conditions',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const bookingRequest = {
        donorId,
        hospitalId,
        donationPurpose: purpose,
        duration: 60,
      };
      
      const result = await bookingServiceInstance.bookAppointment(bookingRequest, selectedSlot);
      
      toast.success('Booking Confirmed', {
        description: `Your appointment has been scheduled for ${format(selectedSlot.start, 'MMMM d, yyyy')} at ${format(selectedSlot.start, 'h:mm a')}`,
      });
      
      window.location.href = `/booking/confirmation/${result.bookingId}`;
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Booking Failed', {
        description: 'Failed to book appointment. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedDate) {
      toast.error('Selection Required', {
        description: 'Please select a date',
      });
      return;
    }
    
    if (step === 2 && !selectedSlot) {
      toast.error('Selection Required', {
        description: 'Please select a time slot',
      });
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (showConnectPrompt) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect to Book</CardTitle>
          <CardDescription>
            To book a donation appointment, we need to access your calendar to find suitable times.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              By connecting with Verida, you allow us to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>View your calendar events to find available slots</li>
              <li>Create new calendar events for your appointments</li>
              <li>{`Ensure we don't double-book your time`}</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={connectToVerida} disabled={isLoading} className="w-full">
            {isLoading ? 'Connecting...' : 'Connect with Verida'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule Your Donation</CardTitle>
        <CardDescription>
          Book an appointment at your convenience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select a Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date: Date) => 
                    date < new Date() || 
                    date.getDay() === 0 || date.getDay() === 6 
                  }
                  className="mx-auto"
                  classNames={{
                    day_selected: "bg-blue-800 text-white hover:bg-blue-900 hover:text-white focus:bg-blue-800 focus:text-white",
                    day_today: "bg-gray-100 text-gray-900 font-bold",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md",
                    day_disabled: "text-gray-300 opacity-50 hover:bg-transparent",
                    day_range_middle: "aria-selected:bg-blue-50",
                    day_hidden: "invisible",
                    caption: "flex justify-center py-2 mb-4 relative items-center",
                    caption_label: "text-base font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-8 w-8 bg-blue-50 hover:bg-blue-100 p-0 rounded-md",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-between mb-2",
                    head_cell: "text-gray-500 rounded-md w-9 font-medium text-xs",
                    row: "flex w-full justify-between mt-2",
                  }}
                />
                {aiRecommendation && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                    <span className="font-medium">AI Recommendation: </span>
                    {aiRecommendation}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select a Time Slot</h3>
                {isLoading ? (
                  <div className="text-center py-8">Loading available times...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p>No available slots on this date.</p>
                    <Button variant="outline" onClick={() => setStep(1)} className="mt-4">
                      Select Another Date
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={selectedSlot === slot ? "default" : "outline"}
                        onClick={() => handleSlotSelect(slot)}
                        className={cn("h-auto py-3 px-4 bg-blue-800 hover:bg-blue-900 hover:text-white text-white", selectedSlot === slot ? "bg-green-600 hover:bg-green-700" : "")}
                      >
                        <div className="text-center">
                          <div>{format(slot.start, 'h:mm a')}</div>
                          <div className="text-xs opacity-70">to {format(slot.end, 'h:mm a')}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Donation Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="purpose" className='mb-4'>Purpose of Donation</Label>
                    <Select value={purpose} onValueChange={setPurpose} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertility-treatment">Fertility Treatment</SelectItem>
                        <SelectItem value="research">Medical Research</SelectItem>
                        <SelectItem value="sperm-banking">Personal Sperm Banking</SelectItem>
                        <SelectItem value="open-donation">Donate for others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or information we should know"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="min-h-[100px] resize-none mt-4"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Review & Confirm</h3>
                
                <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p>{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p>{selectedSlot ? `${format(selectedSlot.start, 'h:mm a')} - ${format(selectedSlot.end, 'h:mm a')}` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Purpose</p>
                      <p>{toPascalCase(purpose) || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hospital</p>
                      <p>Fertility Center</p>
                    </div>
                  </div>
                  
                  {additionalNotes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Additional Notes</p>
                      <p className="text-sm">{additionalNotes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className='data-[state=checked]:border-purple-500 data-[state=checked]:bg-gray-300 data-[state=checked]:text-purple-800 scale-110'
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-sm text-gray-500">
                      By scheduling this appointment, you agree to our donation guidelines and privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button type="button" className='bg-white hover:bg-white' variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            
            {step < 4 ? (
              <Button type="button" className='bg-blue-800 hover:bg-blue-900' onClick={nextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button type="submit" className='bg-blue-800 hover:bg-blue-600' disabled={isLoading || !agreedToTerms}>
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonorBookingForm;