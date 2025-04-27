// Core interfaces
import {
    createAgent,
    IDIDManager,
    IResolver,
    IDataStore,
    IDataStoreORM,
    IKeyManager,
    ICredentialPlugin,
  } from '@veramo/core'
  
// Core identity manager plugin
import { DIDManager } from '@veramo/did-manager'

// Ethr did identity provider
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// Core key manager plugin
import { KeyManager } from '@veramo/key-manager'

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// W3C Verifiable Credential plugin
import { CredentialPlugin } from '@veramo/credential-w3c'

// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'
import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations, DataStore, DataStoreORM } from '@veramo/data-store';
import { DataSource } from 'typeorm'
import { DIDComm, DIDCommMessageHandler } from '@veramo/did-comm'
import { MessageHandler } from '@veramo/message-handler'
import { SelectiveDisclosure } from '@veramo/selective-disclosure'

// This will be the name for the local sqlite database for demo purposes
export const DATABASE_FILE = 'database.sqlite'

// You will need to get a project ID from infura https://www.infura.io
const projectId = process.env.INFURA_PROJECT_ID
const INFURA_PROJECT_ID = `${projectId}`

// This will be the secret key for the KMS (replace this with your secret key)
const secret_key = process.env.KMS_SECRET_KEY
const KMS_SECRET_KEY = `${secret_key}`

export const dbConnection = new DataSource({
    type: 'sqlite',
    database: 'veramo.sqlite',
    synchronize: true,
    migrations,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
}).initialize();

export const VeramoAgent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin>({
    plugins: [
        new KeyManager({
        store: new KeyStore(dbConnection),
        kms: {
            local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
        },
        }),
        new DIDManager({
        store: new DIDStore(dbConnection),
        defaultProvider: 'did:ethr:sepolia',
        providers: {
            'did:ethr:sepolia': new EthrDIDProvider({
            defaultKms: 'local',
            network: 'ethereum',
            rpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
            }),
        },
        // providers: {
        //     'did:ethr:sepolia': new EthrDIDProvider({
        //     defaultKms: 'local',
        //     network: 'sepolia',
        //     rpcUrl: 'https://sepolia.infura.io/v3/' + INFURA_PROJECT_ID,
        //     }),
        // },
        }),
        new DIDResolverPlugin({
        resolver: new Resolver({
            ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
            ...webDidResolver(),
        }),
        }),
        new CredentialPlugin(),
        new DataStore(dbConnection),
        new DataStoreORM(dbConnection),
        new DIDComm(),
        new MessageHandler({
          messageHandlers: [new DIDCommMessageHandler()],
        }),
        new SelectiveDisclosure(),
    ],
})