import Web3 from 'web3';
import rewardABI from './abi/reward.json';
import fixedOraclePriceABI from './abi/fixedOraclePrice.json';
import aiAgentFactoryABI from './abi/aiAgentFactory.json';
import entryPointABI from './abi/entryPoint.json';
import healthDataNftABI from './abi/healthDataNft.json';
import hospitalRequestABI from './abi/hospitalRequest.json';
import hospitalRequestFactoryABI from './abi/hospitalRequestFactory.json';
import hrsABI from './abi/hrs.json';
import marketplaceABI from './abi/marketplace.json';
import profileImageNftABI from './abi/profileImageNft.json';
import processABI from './abi/process.json';
import processFactoryABI from './abi/processFactory.json';
import verificationABI from './abi/verification.json';


const web3 = new Web3(process.env.NEXT_PUBLIC_RPC_URL);
const fixedOraclePriceAddress = process.env.NEXT_PUBLIC_FIXED_ORACLE_PRICE_ADDRESS as string;
const aiAgentFactoryAddress = process.env.NEXT_PUBLIC_AIAGENT_FACTORY_ADDRESS as string;
const entryPointAddress = process.env.NEXT_PUBLIC_ENTRY_POINT_ADDRESS;
const healthDataNftAddress = process.env.NEXT_PUBLIC_HEALTH_DATA_NFT_ADDRESS as string;
const hospitalRequestContractAddress = process.env.NEXT_PUBLIC_HOSPITAL_REQUEST_CONTRACT_ADDRESS as string;
const hospitalRequestFactoryAddress = process.env.NEXT_PUBLIC_HOSPITAL_REQUEST_FACTORY_ADDRESS as string;
const hrsAddress = process.env.NEXT_PUBLIC_HRS_ADDRESS as string;
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as string;
const profileImageNftAddress = process.env.NEXT_PUBLIC_PROFILE_IMAGE_NFT_ADDRESS as string;
const processAddress = process.env.NEXT_PUBLIC_PROCESS_ADDRESS as string;
const processFactoryAddress = process.env.NEXT_PUBLIC_PROCESS_FACTORY_ADDRESS as string;
const verificationAddress = process.env.NEXT_PUBLIC_VERIFICATION_ADDRESS as string;

const rewardAddress = process.env.NEXT_PUBLIC_REWARD_ADDRESS as string;

const rewardContract = new web3.eth.Contract(rewardABI, rewardAddress);
const fixedOraclePriceContract = new web3.eth.Contract(fixedOraclePriceABI, fixedOraclePriceAddress);
const aiAgentFactoryContract = new web3.eth.Contract(aiAgentFactoryABI, aiAgentFactoryAddress);
const entryPointContract = new web3.eth.Contract(entryPointABI, entryPointAddress);
const healthDataNftContract = new web3.eth.Contract(healthDataNftABI, healthDataNftAddress);
const hospitalRequestContract = new web3.eth.Contract(hospitalRequestABI, hospitalRequestContractAddress);
const hospitalRequestFactoryContract = new web3.eth.Contract(hospitalRequestFactoryABI, hospitalRequestFactoryAddress);
const hrsContract = new web3.eth.Contract(hrsABI, hrsAddress);
const marketplaceContract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);
const profileImageNftContract = new web3.eth.Contract(profileImageNftABI, profileImageNftAddress);
const processContract = new web3.eth.Contract(processABI, processAddress);
const processFactoryContract = new web3.eth.Contract(processFactoryABI, processFactoryAddress);
const verificationContract = new web3.eth.Contract(verificationABI, verificationAddress);

export const contractAddresses = {
  fixedOraclePriceAddress,
  aiAgentFactoryAddress,
  entryPointAddress,
  healthDataNftAddress,
  hospitalRequestContractAddress,
  hospitalRequestFactoryAddress,
  hrsAddress,
  marketplaceAddress,
  profileImageNftAddress,
  processAddress,
  processFactoryAddress,
  verificationAddress,
  rewardAddress,
}

export enum DonorType {
  SPERMDONOR,
  EGGDONOR,
  SURROGATE
}


export {
  rewardContract,
  fixedOraclePriceContract,
  aiAgentFactoryContract,
  entryPointContract,
  healthDataNftContract,
  hospitalRequestContract,
  hospitalRequestFactoryContract,
  hrsContract,
  marketplaceContract,
  profileImageNftContract,
  processContract,
  processFactoryContract,
  verificationContract,
  // get

  //   import rewardABI from './abi/reward.json';
  // import fixedOraclePriceABI from './abi/fixedOraclePrice.json';
  // import aiAgentFactoryABI from './abi/aiAgentFactory.json';
  // import entryPointABI from './abi/entryPoint.json';
  // import healthDataNftABI from './abi/healthDataNft.json';
  // import hospitalRequestABI from './abi/hospitalRequest.json';
  // import hospitalRequestFactoryABI from './abi/hospitalRequestFactory.json';
  // import hrsABI from './abi/hrs.json';
  // import marketplaceABI from './abi/marketplace.json';
  // import profileImageNftABI from './abi/profileImageNft.json';
  // import processABI from './abi/process.json';
  // import processFactoryABI from './abi/processFactory.json';
  // import verificationABI from './abi/verification.json';

  // abi
  rewardABI,
  processABI,
  processFactoryABI,
  fixedOraclePriceABI,
  entryPointABI,
  aiAgentFactoryABI,
  healthDataNftABI,
  hospitalRequestABI,
  hospitalRequestFactoryABI,
  hrsABI,
  marketplaceABI,
  profileImageNftABI,
  verificationABI,

  // contract addresses
  fixedOraclePriceAddress,
  aiAgentFactoryAddress,
  entryPointAddress,
  healthDataNftAddress,
  hospitalRequestContractAddress,
  hospitalRequestFactoryAddress,
  hrsAddress,
  marketplaceAddress,
  profileImageNftAddress,
  processAddress,
  processFactoryAddress,
  verificationAddress,
  rewardAddress,
} 