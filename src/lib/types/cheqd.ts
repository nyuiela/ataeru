import { VerifiablePresentation } from "@veramo/core";

export interface IEncryptedData {
  ciphertext: string;
  iv?: string;
  tag?: string;
  type: 'AES-GCM' | 'X25519';
  recipientDid?: string;
  key?: string;
}

export interface UpdatedEncryptedData extends IEncryptedData {
  encryptedContent?: string;
  metadata?: {
    [key: string]: string[];
  };
}

export interface IUserData {
  [key: string]: string[];
}

export interface IDataContext {
  storageType: 'on-chain' | 'off-chain';
  encryptionType?: 'symmetric' | 'asymmetric';
  recipientDid?: string; // For asymmetric encryption
}

export interface IFormField {
  name: string;
  type: string;
  description: string;
  required: boolean;
  sensitive: boolean;
}

export interface IFormDefinition {
  id: string;
  name: string;
  fields: IFormField[];
}

export interface IAgentContext {
  userDid: string;
  agentDid: string;
  formDefinition: IFormDefinition;
}


export interface ISafeData {
  [key: string]: string | number | boolean | object;
}

export interface IAgentMetadata {
  presentation: VerifiablePresentation;
  formDefinition: IFormDefinition;
  userDid: string;
}

export interface IVerifiablePresentation {
  holder: string;
  verifier: string[];
  type: string[];
  verifiableCredential: VerifiableCredential[];
  proofPurpose: string;
  created: string;
  metadata: PresentationMetadata;
  proof?: Record<string, unknown>;
}

export interface PresentationMetadata {
  formId: string;
  sensitiveFields: string[];
  encryptedDataRef: string;
}

export interface VerifiableCredential {
  issuer: string;
  credentialSubject: Record<string, unknown>;
  issuanceDate: string;
  proof?: Record<string, unknown>;
  // Add other necessary fields
}

export interface IAgentResponse {
  success: boolean;
  bookingRef?: string;
  bookingDate?: string;
  error?: string;
  missingFields?: string[];
}

export interface IBookingDetails {
  bookingRef: string;
  date: string;
  [key: string]: string | number | boolean | object;
}

export interface INotification {
  message: string[];
  bookingDetails: IBookingDetails;
}

export interface IBookingRequest {
  donationId?: string;
  fullName?: string;
  dateOfBirth?: string;
  healthQuestionnaire?: string;
  acceptedRequirements?: Record<string, boolean>;
  [key: string]: string[] | Record<string, boolean> | string | undefined;
}
