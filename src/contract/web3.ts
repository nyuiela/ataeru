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

function getPrice() {
  return fixedOraclePriceContract.methods.getPrice().call();
}

function getAiAgentFactory() {
  return aiAgentFactoryContract.methods.getAiAgentFactory().call();
}
function getEntryPoint() {
  return entryPointContract.methods.getEntryPoint().call();
}

function getHealthDataNft() {
  return healthDataNftContract.methods.getHealthDataNft().call();
}
const account = process.env.NEXT_PUBLIC_ACCOUNT;
function mintHealthDataNft() {
  return healthDataNftContract.methods.mint().send({ from: account });
}


//  hospital Request contract
function getHospitalRequestContract(id: number) {
  return hospitalRequestContract.methods.getRequest(id).call();
}
function requestMaxDonor(id: number) {
  return hospitalRequestContract.methods.requestMaxDonor(id).call();
}
function isRequestExpired(id: number) {
  return hospitalRequestContract.methods.isRequestExpired(id).call();
}
enum DonorType {
  SPERMDONOR,
  EGGDONOR,
  SURROGATE
}
function makeMultipleDonorRequest(donorType: DonorType[], rules: string[], date: number[], time: number[], maxDonor: number[], minAmount: number[], maxAmount: number[], status: string[], des: string[]) {
  return hospitalRequestContract.methods.makeMultipleDonorRequest(donorType, rules, date, time, maxDonor, minAmount, maxAmount, status, des).send({ from: account });
}

function isRequestExists(_id: number) {
  return hospitalRequestContract.methods.isRequestExists(_id).call();
}
function getHospitalRequestFactory() {
  return hospitalRequestFactoryContract.methods.getHospitalRequestFactory().call();
}
function makeADonorRequest(donorType: DonorType, rules: string, date: number, time: number, maxDonor: number, minAmount: number, maxAmount: number, status: string, des: string) {
  return hospitalRequestFactoryContract.methods.makeADonorRequest(donorType, rules, date, time, maxDonor, minAmount, maxAmount, status, des).send({ from: account });
}

function getHospitalRequest(id: number) {
  return hospitalRequestFactoryContract.methods.getHospitalRequest(id).call();
}


// hospital request factory contract
function registerUser(name: string, email: string, location: string, contact: number, about: string, witnessHash: string, receiverType: string) {
  return entryPointContract.methods.registerUser(name, email, location, contact, about, witnessHash, receiverType).send({ from: account });
}

function registerDonor(name: string, email: string, bloodGroup: string, location: string, age: number, weight: number, height: number, contact: number, about: string, witnessHash: string, donorType: string) {
  return entryPointContract.methods.registerDonor(name, email, bloodGroup, location, age, weight, height, contact, about, witnessHash, donorType).send({ from: account });
}

function registerHospital(name: string, email: string, location: string, about: string, contact: number, witnessHash: string) {
  return entryPointContract.methods.registerHospital(name, email, location, about, contact, witnessHash).send({ from: account });
}

function isRegistered() {
  return entryPointContract.methods.isRegistered().call();
}

function getUsernDonorInfo(id: string) {
  return entryPointContract.methods.getUsernDonorInfo(id).call();
}
function updateDonorInfomation(id: string, name: string, email: string, bloodGroup: string, location: string, age: number, weight: number, height: number, contact: number, about: string, donorType: string) {
  return entryPointContract.methods.updateDonorInfomation(id, name, email, bloodGroup, location, age, weight, height, contact, about, donorType).send({ from: account });
}

function updateUserInfomation(id: string, name: string, email: string, location: string, contact: number, about: string, receiverType: string) {
  return entryPointContract.methods.updateUserInfomation(id, name, email, location, contact, about, receiverType).send({ from: account });
}

function updateHospitalInfomation(id: string, name: string, email: string, location: string, about: string, contact: number) {
  return entryPointContract.methods.updateHospitalInfomation(id, name, email, location, about, contact).send({ from: account });
}

function deregisterDonor(id: string) {
  return entryPointContract.methods.deregisterDonor(id).send({ from: account });
}

function deregisterUser(id: string) {
  return entryPointContract.methods.deregisterUser(id).send({ from: account });
}

function deregisterHospital(id: string) {
  return entryPointContract.methods.deregisterHospital(id).send({ from: account });
}
function getUserDonorInfo(id: string) {
  return entryPointContract.methods.getUsernDonorInfo(id).call();
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
  getPrice,
  getAiAgentFactory,
  getEntryPoint,
  getHealthDataNft,
  mintHealthDataNft,
  getHospitalRequestContract,
  requestMaxDonor,
  isRequestExpired,
  makeMultipleDonorRequest,
  isRequestExists,
  getHospitalRequestFactory,
  makeADonorRequest,
  getHospitalRequest,
  // register
  registerUser,
  registerDonor,
  registerHospital,
  isRegistered,
  getUsernDonorInfo,
  updateDonorInfomation,
  updateUserInfomation,
  updateHospitalInfomation,
  deregisterDonor,
  deregisterUser,
  deregisterHospital,
  getUserDonorInfo,

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