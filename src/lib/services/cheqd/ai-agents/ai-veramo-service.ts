// import { IAgentContext, IAgentMetadata, IBookingDetails, IBookingRequest, IFormDefinition, INotification, ISafeData, IUserData, UpdatedEncryptedData } from "@/lib/types/cheqd";
// import { VeramoDataService } from "../users/user-veramo-service";
// import { ChatGroq } from '@langchain/groq';


// export class AIAgentService {
//   private veramoService: VeramoDataService;
//   private llm: ChatGroq;

//   constructor() {
//     this.veramoService = new VeramoDataService();
//     this.llm = new ChatGroq({
//       apiKey: process.env.GROQ_API_KEY,
//       model: "llama-3.3-70b-versatile",
//       temperature: 0.5,
//     });
//   }

//   /**
//    * Prepare user data for AI agent processing
//    * @param userData Raw user data
//    * @param context Agent context
//    * @returns Processed data safe for AI agent
//    */
//   public async prepareDataForAgent(
//     userData: IUserData,
//     context: IAgentContext
//   ): Promise<{ 
//     safeData: ISafeData, 
//     metadata: IAgentMetadata 
//   }> {
//     // Identify sensitive fields from form definition
//     const sensitiveFields = context.formDefinition.fields
//       .filter(f => f.sensitive)
//       .map(f => f.name);

//     // Separate sensitive and non-sensitive data
//     const sensitiveData: IUserData = {};
//     const safeData: ISafeData = {};

//     Object.keys(userData).forEach(key => {
//       if (sensitiveFields.includes(key)) {
//         sensitiveData[key] = userData[key];
//       } else {
//         safeData[key] = userData[key];
//       }
//     });

//     // Encrypt sensitive data
//     const encryptedData: UpdatedEncryptedData = await this.veramoService.encryptUserData(
//       sensitiveData,
//       {
//         storageType: 'off-chain',
//         encryptionType: 'asymmetric',
//         recipientDid: context.userDid, // Encrypt to user's DID
//       }
//     );
//     encryptedData.ciphertext.toString()

//     const encryptedDataRef = await this.veramoService.storeUserData(
//       sensitiveData,
//       { storageType: 'off-chain' }
//     );

//     // Create verifiable presentation for the agent
//     const presentation = await this.veramoService.agent.createVerifiablePresentation({
//       presentation: {
//         holder: context.agentDid,
//         verifier: [context.userDid],
//         type: ['VerifiablePresentation', 'AgentDataRequest'],
//         verifiableCredential: [], // Would include any needed credentials
//         proofPurpose: 'authentication',
//         created: new Date().toISOString(),
//         metadata: {
//           formId: context.formDefinition.id,
//           sensitiveFields,
//           encryptedDataRef,
//         },
//       },
//       proofFormat: 'jwt',
//     });

//     return {
//       safeData,
//       metadata: {
//         presentation,
//         formDefinition: context.formDefinition,
//         userDid: context.userDid,
//       },
//     };
//   }

//   /**
//    * Process form submission through AI agent using LangChain
//    * @param safeData Non-sensitive data
//    * @param metadata Processing metadata
//    * @returns Form submission result
//    */
//   public async processFormWithAgent(
//     safeData: ISafeData,
//     metadata: IAgentMetadata
//   ): Promise<{ 
//     success: boolean, 
//     bookingRef?: string,
//     userNotification?: INotification,
//     error?: string 
//   }> {
//     try {
//       // Build the prompt for the LLM
//       const prompt = this.buildAgentPrompt(
//         safeData, 
//         metadata.formDefinition
//       );
      
//       // Call the LLM through LangChain
//       const response = await this.llm.invoke(prompt);
      
//       // Parse the response (assuming LLM returns JSON string)
//       let result;
//       try {
//         // Try to extract JSON from the response content
//         const contentString = typeof response.content === 'string' 
//           ? response.content 
//           : JSON.stringify(response.content);
//         result = JSON.parse(contentString);
//       } catch (error) {
//         console.error('Failed to parse LLM response:', response.content, error);
//         throw new Error('Invalid response from booking agent');
//       }
      
//       if (!result.success) {
//         throw new Error(result.error || 'Booking failed');
//       }
      
//       // If booking was successful, prepare user notification
//       const bookingDetails: IBookingDetails = {
//         ...safeData,
//         bookingRef: result.bookingRef,
//         date: result.bookingDate,
//       };

//       // Send confirmation to user
//       const notification = await this.sendUserNotification(
//         metadata.userDid,
//         bookingDetails
//       );

//       return {
//         success: true,
//         bookingRef: result.bookingRef,
//         userNotification: notification,
//       };
//     } catch (error) {
//       console.error('Form processing error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error',
//       };
//     }
//   }

//   /**
//    * Process donation booking request
//    * @param request Booking request data
//    * @param userDid User's DID
//    * @returns Booking result
//    */
//   public async processDonationBooking(
//     request: IBookingRequest,
//     userDid: string
//   ): Promise<{ success: boolean; bookingRef?: string; error?: string }> {
//     try {
//       // Prepare the prompt for the LLM
//       const prompt = await this.buildBookingPrompt(request);
      
//       // Call the LLM
//       const response = await this.llm.invoke(prompt);
      
//       // Parse the response (assuming LLM returns JSON string)
//       let result;
//       try {
//         const contentString = typeof response.content === 'string' 
//           ? response.content 
//           : JSON.stringify(response.content);
//         result = JSON.parse(contentString);
//       } catch (error) {
//         console.error('Failed to parse LLM response:', response.content, error);
//         throw new Error('Invalid response from booking agent');
//       }
      
//       if (!result.success) {
//         throw new Error(result.error || 'Booking failed');
//       }
      
//       // Send confirmation to user
//       await this.sendBookingConfirmation(userDid, {
//         bookingRef: result.bookingRef,
//         donationId: request.donationId,
//         date: result.bookingDate,
//       });
      
//       return {
//         success: true,
//         bookingRef: result.bookingRef,
//       };
//     } catch (error) {
//       console.error('Booking processing error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error',
//       };
//     }
//   }

//   private async buildBookingPrompt(request: IBookingRequest): Promise<string> {
//     // Get form definition from your system (simplified here)
//     const formDefinition = {
//       fields: [
//         { name: 'fullName', required: true },
//         { name: 'dateOfBirth', required: true },
//         { name: 'healthQuestionnaire', required: true },
//         ...(request.acceptedRequirements ? 
//           Object.keys(request.acceptedRequirements).map(req => ({
//             name: req,
//             required: true,
//           })) : []),
//       ],
//     };
    
//     return JSON.stringify({
//       type: 'donation_booking',
//       version: '1.0',
//       request,
//       formDefinition,
//       instructions: `
//         You are a booking agent for a sperm donation platform. Process this booking request by:
//         1. Validating all required fields are present
//         2. Checking the donor meets all requirements
//         3. Generating a booking reference
//         4. Returning the next available appointment slot
        
//         Respond with JSON format: {
//           success: boolean,
//           bookingRef: string,
//           bookingDate: string (ISO format),
//           error?: string
//         }
//       `,
//     });
//   }

//   private buildAgentPrompt(
//     data: ISafeData,
//     formDefinition: IFormDefinition
//   ): string {
//     // Build a structured prompt for the LLM
//     return `
//       You are a booking assistant helping a user schedule a hospital appointment.
//       The user has provided the following information:
      
//       ${JSON.stringify(data, null, 2)}
      
//       The form requires these fields:
//       ${formDefinition.fields.map(f => `- ${f.name}: ${f.description} (${f.required ? 'required' : 'optional'})`).join('\n')}
      
//       Please:
//       1. Validate the provided information
//       2. Fill in any missing required fields by asking for clarification if needed
//       3. Submit the form to the hospital booking system
//       4. Return a booking reference if successful
      
//       Respond in JSON format with: {success: boolean, bookingRef?: string, bookingDate?: string, missingFields?: string[], error?: string}
//     `;
//   }

//   private async sendBookingConfirmation(
//     userDid: string,
//     details: { bookingRef: string; donationId?: string; date: string }
//   ): Promise<void> {
//     // Store the booking confirmation as a verifiable credential
//     await this.veramoService.agent.createVerifiableCredential({
//       credential: {
//         '@context': ['https://www.w3.org/2018/credentials/v1'],
//         type: ['VerifiableCredential', 'DonationBooking'],
//         issuer: await this.veramoService.agent.didManagerGetDefaultDid(),
//         issuanceDate: new Date().toISOString(),
//         credentialSubject: {
//           id: userDid,
//           bookingRef: details.bookingRef,
//           donationId: details.donationId,
//           appointmentDate: details.date,
//           status: 'confirmed',
//         },
//       },
//       proofFormat: 'jwt',
//     });
    
//     // Add to chat history
//     const chatMessage = {
//       role: 'assistant',
//       content: `Your donation appointment has been booked! 🎉
      
//       **Reference:** ${details.bookingRef}
//       **Appointment Date:** ${new Date(details.date).toLocaleDateString()}
      
//       You can view your upcoming appointments in your profile.`,
//       metadata: {
//         type: 'booking_confirmation',
//         bookingRef: details.bookingRef,
//         timestamp: new Date().toISOString(),
//       },
//     };
    
//     // In a real app, you would save this to your chat history
//     console.log('Chat message:', chatMessage);
//   }

//   private async sendUserNotification(
//     userDid: string,
//     bookingDetails: IBookingDetails
//   ): Promise<INotification> {
//     // Send via DIDComm message
//     const message = {
//       type: 'https://schemas.veramo.io/notification/1.0/booking',
//       to: userDid,
//       from: await this.veramoService.agent.didManagerGetDefaultDid(),
//       created_time: Date.now().toString(),
//       body: {
//         message: 'Your hospital appointment has been booked',
//         details: bookingDetails,
//         actions: [
//           {
//             type: 'view',
//             url: `https://your-service.com/bookings/${bookingDetails.bookingRef}`,
//           },
//           {
//             type: 'cancel',
//             url: `https://your-service.com/bookings/${bookingDetails.bookingRef}/cancel`,
//           },
//         ],
//       },
//     };

//     const packedMessage = await this.veramoService.agent.packDIDCommMessage({
//       packing: 'authcrypt',
//       message,
//     });

//     // In a real implementation, you would send this message via a messaging protocol
//     // For demo purposes, we'll just return it
//     return {
//       message: packedMessage,
//       bookingDetails,
//     };
//   }

//   public async getCurrentUserDid(address: string): Promise<string> {
//     return `did:ethr:${address}`;
//   }
// }