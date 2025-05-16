import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format, } from 'date-fns';
import { toast } from 'sonner';
import VeridaService from '@/lib/services/verida/verida-service';
import InviteService from '@/lib/services/verida/invites';

interface DonorPreview {
  id: string;
  name: string;
  email: string;
  age: number;
  previousDonations: number;
  lastDonationDate?: Date;
  tags: string[];
  selected: boolean;
}

interface HospitalInviteManagementProps {
  hospitalId: string;
  isAuthenticated: boolean;
}

interface Invite {
  donorId: string;
  invitationId: string;
  content: string;
}

interface InviteResult {
  success: boolean;
  invitationId: string;
  sentTo: string;
  sentAt: Date;
}

const HospitalInviteManagement: React.FC<HospitalInviteManagementProps> = ({
  hospitalId,
  isAuthenticated,
}) => {
  const [step, setStep] = useState(1);
  const [donors, setDonors] = useState<DonorPreview[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<DonorPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [compensationOffered, setCompensationOffered] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [previewInvites, setPreviewInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConnectPrompt, setShowConnectPrompt] = useState(!isAuthenticated);
  
  const router = useRouter();
  
  // Initialize services
  const veridaServiceInstance = new VeridaService();
  const inviteServiceInstance = new InviteService();

  // Check if user is authenticated with Verida
  useEffect(() => {
    setShowConnectPrompt(!isAuthenticated);
    
    // Fetch donors if authenticated
    if (isAuthenticated) {
      fetchDonors();
    }
  }, [isAuthenticated]);

  // Filter donors based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDonors(donors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = donors.filter(donor => 
        donor.name.toLowerCase().includes(query) || 
        donor.email.toLowerCase().includes(query) ||
        donor.tags.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredDonors(filtered);
    }
  }, [searchQuery, donors]);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this from your API
      // For now, using mock data
      const mockDonors: DonorPreview[] = [
        {
          id: 'donor-1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          age: 28,
          previousDonations: 3,
          lastDonationDate: new Date(2024, 2, 15),
          tags: ['regular', 'healthy'],
          selected: false
        },
        {
          id: 'donor-2',
          name: 'David Johnson',
          email: 'david.johnson@example.com',
          age: 32,
          previousDonations: 1,
          lastDonationDate: new Date(2024, 1, 5),
          tags: ['new', 'high-mobility'],
          selected: false
        },
        {
          id: 'donor-3',
          name: 'Michael Brown',
          email: 'michael.brown@example.com',
          age: 25,
          previousDonations: 0,
          tags: ['first-time', 'young'],
          selected: false
        },
        {
          id: 'donor-4',
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          age: 34,
          previousDonations: 5,
          lastDonationDate: new Date(2024, 3, 10),
          tags: ['premium', 'regular', 'healthy'],
          selected: false
        },
        {
          id: 'donor-5',
          name: 'Daniel Taylor',
          email: 'daniel.taylor@example.com',
          age: 29,
          previousDonations: 2,
          lastDonationDate: new Date(2024, 0, 18),
          tags: ['occasional', 'preferred-morning'],
          selected: false
        }
      ];
      
      setDonors(mockDonors);
      setFilteredDonors(mockDonors);
    } catch (error) {
      console.error('Error fetching donors:', error);
      toast.error('Error', {
        description: 'Failed to fetch donors. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectToVerida = async () => {
    try {
      setIsLoading(true);
      // Generate auth URL
      const authUrl = await veridaServiceInstance.generateAuthUrl(window.location.origin + router.asPath);
      // Redirect to Verida auth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting to Verida:', error);
      toast.error('Connection Failed',{
        description: 'Failed to connect to Verida. Please try again.',
      });
      setIsLoading(false);
    }
  };

  const toggleDonorSelection = (donorId: string) => {
    const updatedDonors = donors.map(donor =>
      donor.id === donorId ? { ...donor, selected: !donor.selected } : donor
    );
    setDonors(updatedDonors);
    setFilteredDonors(
      filteredDonors.map(donor =>
        donor.id === donorId ? { ...donor, selected: !donor.selected } : donor
      )
    );
  };

  const selectAllDonors = () => {
    const allSelected = filteredDonors.every(donor => donor.selected);
    const updatedFilteredDonors = filteredDonors.map(donor => ({
      ...donor,
      selected: !allSelected,
    }));
    
    // Update main donors list with the same selections
    const updatedDonors = donors.map(donor => {
      const filteredDonor = updatedFilteredDonors.find(fd => fd.id === donor.id);
      return filteredDonor ? { ...donor, selected: filteredDonor.selected } : donor;
    });
    
    setDonors(updatedDonors);
    setFilteredDonors(updatedFilteredDonors);
  };

  const generateInvites = async () => {
    const selectedDonorIds = donors.filter(donor => donor.selected).map(donor => donor.id);
    
    if (selectedDonorIds.length === 0) {
      toast.error('No Donors Selected',{
        description: 'Please select at least one donor to send invites to.',
      });
      return;
    }
    
    if (!purpose) {
      toast.error('Purpose Required',{
        description: 'Please specify the purpose of the donation.',
      });
      return;
    }
    
    if (!dateRange.start || !dateRange.end) {
      toast.error('Date Range Required',{
        description: 'Please specify the proposed date range for donations.',
      });
      return;
    }
    
    setIsGenerating(true);
    try {
      // Prepare the invite request
      const inviteRequest = {
        hospitalId,
        donorIds: selectedDonorIds,
        purpose,
        urgency,
        compensationOffered: compensationOffered ? parseFloat(compensationOffered) : undefined,
        additionalRequirements: additionalRequirements ? additionalRequirements.split('\n') : undefined,
        proposedDateRanges: [
          {
            start: dateRange.start as Date,
            end: dateRange.end as Date,
          }
        ]
      };
      
      // Call the invite service to create personalized invites
      const result = await inviteServiceInstance.createPersonalizedInvites(inviteRequest);
      
      if (result.success && result.invitations) {
        setPreviewInvites(result.invitations);
        
        toast.success('Invites Generated',{
          description: `Successfully generated ${result.invitations.length} personalized invitations.`,
        });
        
        // Move to preview step
        setStep(3);
      } else {
        throw new Error('Failed to generate invitations');
      }
    } catch (error) {
      console.error('Error generating invites:', error);
      toast.error('Generation Failed',{
        description: 'Failed to generate personalized invites. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendInvites = async () => {
    if (previewInvites.length === 0) {
      toast.error('No Invites',{
        description: 'There are no invites to send.',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Send each invitation
      const results = await Promise.all(
        previewInvites.map(invite => inviteServiceInstance.sendInvitation(invite.invitationId))
      ) as InviteResult[];
      
      const successCount = results.filter(result => result.success).length;
      
      toast.success('Invites Sent',{
        description: `Successfully sent ${successCount} out of ${previewInvites.length} invitations.`,
      });
      
      // Redirect to invites list
      router.push('/hospital/invites');
    } catch (error) {
      console.error('Error sending invites:', error);
      toast.error('Send Failed',{
        description: 'Failed to send invitations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      const selectedDonorCount = donors.filter(donor => donor.selected).length;
      if (selectedDonorCount === 0) {
        toast.error('No Donors Selected',{
          description: 'Please select at least one donor to proceed.',
        });
        return;
      }
    } else if (step === 2) {
      if (!inviteTitle) {
        toast.error('Title Required',{
          description: 'Please provide a title for the invitation.',
        });
        return;
      }
      
      if (!purpose) {
        toast.error('Purpose Required',{
          description: 'Please specify the purpose of the donation.',
        });
        return;
      }
      
      if (!dateRange.start || !dateRange.end) {
        toast.error('Date Range Required',{
          description: 'Please specify the proposed date range for donations.',
        });
        return;
      }
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Render connect to Verida prompt if not authenticated
  if (showConnectPrompt) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connect to Access Hospital Tools</CardTitle>
          <CardDescription>
            To manage donor invitations, we need access to your hospital calendar and profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              By connecting with Verida, you allow our platform to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access your hospital calendar to schedule donations</li>
              <li>View donor profiles and history (with their permission)</li>
              <li>Send personalized invitations to donors</li>
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
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Create Donor Invitations</CardTitle>
        <CardDescription>
          Send personalized invites to potential donors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select Donors</h3>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search donors by name, email, or tags"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={selectAllDonors}
                >
                  {filteredDonors.every(donor => donor.selected) ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="border rounded-md">
                {isLoading ? (
                  <div className="p-8 text-center">Loading donors...</div>
                ) : filteredDonors.length === 0 ? (
                  <div className="p-8 text-center">No donors found matching your search.</div>
                ) : (
                  <>
                    <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm border-b bg-gray-50">
                      <div className="col-span-1"></div>
                      <div className="col-span-3">Name</div>
                      <div className="col-span-3">Email</div>
                      <div className="col-span-1">Age</div>
                      <div className="col-span-2">Donations</div>
                      <div className="col-span-2">Tags</div>
                    </div>
                    
                    <div className="divide-y">
                      {filteredDonors.map(donor => (
                        <div 
                          key={donor.id} 
                          className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 ${donor.selected ? 'bg-blue-50' : ''}`}
                          onClick={() => toggleDonorSelection(donor.id)}
                        >
                          <div className="col-span-1">
                            <Checkbox 
                              checked={donor.selected}
                              onCheckedChange={() => toggleDonorSelection(donor.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="col-span-3 font-medium">{donor.name}</div>
                          <div className="col-span-3 text-gray-600">{donor.email}</div>
                          <div className="col-span-1">{donor.age}</div>
                          <div className="col-span-2">
                            <div>{donor.previousDonations} donations</div>
                            {donor.lastDonationDate && (
                              <div className="text-xs text-gray-500">
                                Last: {format(donor.lastDonationDate, 'MMM d, yyyy')}
                              </div>
                            )}
                          </div>
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {donor.tags.map((tag, i) => (
                              <span 
                                key={i} 
                                className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {donors.filter(d => d.selected).length} of {donors.length} donors selected
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Invitation Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Invitation Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Urgent Sperm Donation Request"
                      value={inviteTitle}
                      onChange={(e) => setInviteTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="purpose">Donation Purpose</Label>
                    <Select value={purpose} onValueChange={setPurpose} required>
                      <SelectTrigger id="purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fertility-treatment">Fertility Treatment</SelectItem>
                        <SelectItem value="ivf-program">IVF Program</SelectItem>
                        <SelectItem value="research">Medical Research</SelectItem>
                        <SelectItem value="gene-therapy">Gene Therapy Research</SelectItem>
                        <SelectItem value="sperm-banking">Sperm Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <RadioGroup 
                      id="urgency" 
                      value={urgency} 
                      onValueChange={(value: string) => setUrgency(value as 'low' | 'medium' | 'high')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="urgency-low" />
                        <Label htmlFor="urgency-low" className="cursor-pointer">Low</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="urgency-medium" />
                        <Label htmlFor="urgency-medium" className="cursor-pointer">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="urgency-high" />
                        <Label htmlFor="urgency-high" className="cursor-pointer">High</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="compensation">Compensation Offered (USD)</Label>
                    <Input
                      id="compensation"
                      type="number"
                      placeholder="e.g., 100"
                      min="0"
                      value={compensationOffered}
                      onChange={(e) => setCompensationOffered(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Proposed Date Range</Label>
                    <div className="border rounded-md p-4 mt-1">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateRange.start,
                          to: dateRange.end
                        }}
                        onSelect={(range) => {
                          if (range) {
                            setDateRange({
                              start: range.from,
                              end: range.to
                            });
                          }
                        }}
                        disabled={(date: Date) => date < new Date()}
                        numberOfMonths={2}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="requirements">Additional Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Enter any special requirements for donors"
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Preview Invitations</h3>
              
              {isGenerating ? (
                <div className="text-center py-8">
                  <p className="mb-2">Generating personalized invitations...</p>
                  <p className="text-sm text-gray-500">
                    Our AI is analyzing donor preferences and crafting tailored messages.
                  </p>
                </div>
              ) : previewInvites.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <p>No invitations have been generated yet.</p>
                  <Button onClick={generateInvites}>Generate Invitations</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {previewInvites.length} personalized invitations ready to send
                    </p>
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Edit Details
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {previewInvites.slice(0, 3).map((invite, index) => {
                      // Find the donor for this invite
                      const donor = donors.find(d => d.id === invite.donorId);
                      
                      return (
                        <div key={index} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                            <div className="font-medium">
                              Invitation for {donor?.name || 'Donor'}
                            </div>
                            <Button variant="outline" size="sm">View Full</Button>
                          </div>
                          <div className="p-4">
                            <div className="prose max-w-none text-sm">
                              {invite.content.length > 300 
                                ? invite.content.substring(0, 300) + '...' 
                                : invite.content}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {previewInvites.length > 3 && (
                      <div className="text-center py-2">
                        <Button variant="link">
                          Show {previewInvites.length - 3} more invitations
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
            Back
          </Button>
        )}
        
        {step < 3 ? (
          <Button type="button" onClick={nextStep} disabled={isLoading} className={step === 1 ? 'ml-auto' : ''}>
            Continue
          </Button>
        ) : (
          <div className={`flex gap-4 ${step === 3 && !previewInvites.length ? 'mx-auto' : 'ml-auto'}`}>
            {previewInvites.length === 0 ? (
              <Button onClick={generateInvites} disabled={isLoading || isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Invitations'}
              </Button>
            ) : (
              <Button onClick={sendInvites} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? 'Sending...' : 'Send Invitations'}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default HospitalInviteManagement;