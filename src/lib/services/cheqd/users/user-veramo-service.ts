"use client"
import { ethers } from 'ethers';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { IUserData, IDataContext, IEncryptedData } from '@/lib/types/cheqd';
import { VeramoAgent } from '@/lib/types/veramo';

const projectId = process.env.INFURA_PROJECT_ID
const INFURA_PROJECT_ID = `${projectId}`

// Main Veramo Data Service
export class VeramoDataService {
  agent = VeramoAgent

  constructor() {
    this.initializeAgent();
  }

  private async initializeAgent() {
    // Veramo agent setup
    this.agent = VeramoAgent;
  }

  /**
   * Encrypt user data based on context
   * @param data User data to encrypt
   * @param context Encryption context
   * @returns Encrypted data payload
   */
  public async encryptUserData(data: IUserData, context: IDataContext): Promise<IEncryptedData> {
    try {
      if (context.encryptionType === 'asymmetric' && context.recipientDid) {
        // Asymmetric encryption (DIDComm)
        const message = JSON.stringify(data);
        const encryptedMessage = await this.agent.packDIDCommMessage({
          packing: 'authcrypt',
          message: {
            type: 'https://didcomm.org/basicmessage/2.0/message',
            to: context.recipientDid,
            from: await this.agent.didManagerGetDefaultDid(),
            created_time: Date.now().toString(),
            body: { message },
          },
        });
        return {
          ciphertext: encryptedMessage,
          type: 'X25519',
          recipientDid: context.recipientDid,
        };
      } else {
        // Symmetric encryption (AES-GCM)
        const algorithm = 'aes-256-gcm';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let ciphertext = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        const tag = cipher.getAuthTag();

        return {
          ciphertext,
          iv: iv.toString('hex'),
          tag: tag.toString('hex'),
          type: 'AES-GCM',
          key: key.toString('hex'), // Store key for later decryption
        };
      }
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt user data');
    }
  }

  /**
   * Decrypt user data
   * @param encryptedData Encrypted data payload
   * @param context Original encryption context
   * @returns Decrypted user data
   */
  public async decryptUserData(encryptedData: IEncryptedData, context: IDataContext): Promise<IUserData> {
    try {
      if (encryptedData.type === 'X25519' && context.recipientDid) {
        // DIDComm decryption
        const decryptedMessage = await this.agent.unpackDIDCommMessage({
          packedMessage: encryptedData.ciphertext,
        });
        return JSON.parse(decryptedMessage.message.body.message);
      } else {
        // AES-GCM decryption
        const algorithm = 'aes-256-gcm';
        // Assuming encryptedData now has a key property we added during encryption
        const key = encryptedData.key ? Buffer.from(encryptedData.key, 'hex') : null;

        if (!key) {
          throw new Error('Decryption key not found');
        }

        if (!encryptedData.iv || !encryptedData.tag) {
          throw new Error('Missing IV or authentication tag for decryption');
        }

        const decipher = crypto.createDecipheriv(
          algorithm,
          key,
          Buffer.from(encryptedData.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

        let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt user data');
    }
  }

  /**
   * Store user data (on-chain or off-chain)
   * @param data User data to store
   * @param context Storage context
   * @returns Storage reference (hash or ID)
   */
  public async storeUserData(data: IUserData, context: IDataContext): Promise<string> {
    const encryptedData = await this.encryptUserData(data, context);

    if (context.storageType === 'on-chain') {
      // Store hash on-chain (using Ethereum as example)
      // Updated for ethers v6
      const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
      const wallet = new ethers.Wallet('YOUR-PRIVATE-KEY', provider);
      const contract = new ethers.Contract(
        'YOUR-SMART-CONTRACT-ADDRESS',
        ['function storeData(bytes32 dataHash) public'],
        wallet
      );

      // Updated for ethers v6
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(encryptedData)));
      const tx = await contract.storeData(dataHash);
      await tx.wait();

      return tx.hash;
    } else {
      // Store encrypted data off-chain
      const unsignedCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'EncryptedUserData'],
        issuer: await this.agent.didManagerGetDefaultDid(),
        issuanceDate: new Date().toISOString(),
        id: 'urn:uuid:' + uuidv4(),
        credentialSubject: {
          encryptedData
        }
      };

      const credential = await this.agent.createVerifiableCredential({
        credential: unsignedCredential,
        proofFormat: 'jwt'
      });

      const dataRef = await this.agent.dataStoreSaveVerifiableCredential({
        verifiableCredential: credential
      });

      return dataRef;
    }
  }

  /**
   * Retrieve user data
   * @param reference Storage reference (hash or ID)
   * @param context Original storage context
   * @returns Decrypted user data
   */
  public async retrieveUserData(reference: string, context: IDataContext): Promise<IUserData> {
    if (context.storageType === 'on-chain') {
      // Retrieve from blockchain
      // Updated for ethers v6
      const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
      const contract = new ethers.Contract(
        'YOUR-SMART-CONTRACT-ADDRESS',
        ['function getData(bytes32 dataHash) public view returns (bool)'],
        provider
      );

      const exists = await contract.getData(reference);
      if (!exists) throw new Error('Data not found on-chain');

      // In a real implementation, you would need a way to retrieve the encrypted data
      // This might involve IPFS or another off-chain storage referenced by the hash
      throw new Error('On-chain data retrieval not fully implemented in this example');
    } else {
      // Retrieve from Veramo data store
      const credential = await this.agent.dataStoreGetVerifiableCredential({
        hash: reference,
      });

      if (!credential) throw new Error('Credential not found');

      const encryptedData = credential.credentialSubject.encryptedData;
      return await this.decryptUserData(encryptedData, context);
    }
  }
}