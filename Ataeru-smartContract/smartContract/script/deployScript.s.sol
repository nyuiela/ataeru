// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {FixedPriceOracle} from "../src/Oracle/FixedPriceOracle.sol";
import {AiAgent} from "../src/core/DeployPersonalizedAI.sol";
import {EntryPoint} from "../src/core/EntryPoint.sol";
import {HealthDataNFT} from "../src/core/HealthDataNFT.sol";
import {HospitalRequestContract} from "../src/core/HospitalRequestContract.sol";
import {HospitalRequestFactoryContract} from "../src/core/HospitalRequestFactory.sol";
import {HRC} from "../src/core/HRS.sol";
import {MarketPlace} from "../src/core/MarketPlace.sol";
import {ProfileImageNfts} from "../src/core/NftContract.sol";
import {Process} from "../src/core/Process.sol";
import {ProcessFactoryContract} from "../src/core/ProcessFactory.sol";
import {VerificationOfParties} from "../src/core/VerificationOfParties.sol";
import {AiAgentFactory} from "../src/core/AgentFactory.sol";
import "../src/core/reward.sol";
import "forge-std/console.sol";

contract DeployScript is Script {
    AiAgentFactory agentFactory;
    FixedPriceOracle oracle;
    AiAgent ai;
    EntryPoint entry;
    HealthDataNFT hnft;
    HospitalRequestContract requestContract;
    HospitalRequestFactoryContract requestFactory;
    HRC hrc;
    MarketPlace market;
    ProfileImageNfts pnft;
    Process process;
    ProcessFactoryContract processFactory;
    VerificationOfParties verification;

    RewardContract reward;
    address public hospitalAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    uint256 public maxdonors = 50;
    address tokenAddress = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    uint256 stepsToComplete = 9;
    uint256 _price = 6;
    address nftReceiptent = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    function run() public {
        vm.createSelectFork(vm.rpcUrl("basechain"));
        vm.startBroadcast();
        vm.rpcUrl("localchain");
        oracle = new FixedPriceOracle(_price);

        agentFactory = new AiAgentFactory();
        hrc = new HRC(address(entry), address(requestContract));
        ai = new AiAgent(
            address(hrc),
            address(verification),
            address(agentFactory)
        );
        process = new Process();
        hnft = new HealthDataNFT(address(process));
        requestContract = new HospitalRequestContract();
        requestFactory = new HospitalRequestFactoryContract(
            address(requestContract),
            address(hospitalAddress),
            maxdonors
        );
        entry = new EntryPoint(address(requestFactory));
        market = new MarketPlace(
            address(hnft),
            address(tokenAddress),
            address(oracle)
        );
        pnft = new ProfileImageNfts();

        processFactory = new ProcessFactoryContract(
            address(process),
            address(nftReceiptent),
            address(hrc),
            stepsToComplete
        );

        verification = new VerificationOfParties();
        reward = new RewardContract(address(hrc));
        vm.stopBroadcast();

        console.log("NEXT_PUBLIC_FIXED_ORACLE_PRICE_ADDRESS=", address(oracle));
        console.log(
            "NEXT_PUBLIC_AIAGENT_FACTORY_ADDRESS=",
            address(agentFactory)
        );
        console.log("NEXT_PUBLIC_ENTRY_POINT_ADDRESS=", address(entry));
        console.log("NEXT_PUBLIC_HEALTH_DATA_NFT_ADDRESS=", address(hnft));
        console.log(
            "NEXT_PUBLIC_HOSPITAL_REQUEST_CONTRACT_ADDRESS=",
            address(requestContract)
        );
        console.log(
            "NEXT_PUBLIC_HOSPITAL_REQUEST_FACTORY_ADDRESS=",
            address(requestFactory)
        );
        console.log("NEXT_PUBLIC_HRS_ADDRESS=", address(hrc));
        console.log("NEXT_PUBLIC_MARKETPLACE_ADDRESS=", address(market));
        console.log("NEXT_PUBLIC_PROFILE_IMAGE_NFT_ADDRESS=", address(pnft));
        console.log("NEXT_PUBLIC_PROCESS_ADDRESS=", address(process));
        console.log("NEXT_PUBLIC_AI=", address(ai));
        console.log(
            "NEXT_PUBLIC_PROCESS_FACTORY_ADDRESS=",
            address(processFactory)
        );
        console.log("NEXT_PUBLIC_VERIFICATION_ADDRESS=", address(verification));
        console.log("NEXT_PUBLIC_REWARD_ADDRESS=", address(reward));
    }
}
