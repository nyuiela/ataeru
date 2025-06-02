// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../core/HRS.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Process is Initializable {
    HRC public HRS;

    uint256 public step = 1;
    uint256 public stepToComplete;
    address public nftReceipt;

    enum StepGrade {
        A,
        B,
        C,
        F
    }

    struct StepDetails {
        string stepName;
        uint40 startTime;
        uint40 endTime;
        address user;
        bytes32 DonorInfoHash;
        int256 DonorReputation;
        StepGrade stepGrade;
        bytes32 Hrid;
        string stepSummary;
        uint256 stepId;
        bool isStarted;
        bool isCompleted;
        bool fin;
    }

    mapping(uint256 => StepDetails) public stepInfo;

    function initialize(address __nftReceipt, address _hrs, uint256 __stepToComplete) public initializer {
        nftReceipt = __nftReceipt;
        stepToComplete = __stepToComplete;
        HRS = HRC(_hrs);
    }

    function makeStep(StepDetails[] memory details) public {
        for (uint256 i = 0; i < details.length; i++) {
            require(HRS.isMemberOfSet(details[i].user, details[i].Hrid), "User not in HRS set");
            _makeStep(details[i]);
        }
    }

    function _makeStep(StepDetails memory _details) internal {
        uint256 stepId = step++;
        stepInfo[stepId] = StepDetails({
            stepName: _details.stepName,
            startTime: _details.startTime,
            endTime: _details.endTime,
            user: _details.user,
            DonorInfoHash: _details.DonorInfoHash,
            DonorReputation: HRS.getUserReputation(),//TODO
            stepGrade: _details.stepGrade,
            Hrid: _details.Hrid,
            stepSummary: _details.stepSummary,
            stepId: stepId,
            isStarted: false,
            isCompleted: false,
            fin: false
        });
    }

    function startStep(uint256 _stepId) public {
        StepDetails storage info = stepInfo[_stepId];
        require(block.timestamp >= info.startTime, "Step hasn't started yet");
        info.isStarted = true;
    }

    function completeStep(uint256 _stepId) public {
        StepDetails storage info = stepInfo[_stepId];
        require(block.timestamp >= info.endTime, "Step not finished yet");
        require(info.isStarted, "Step not started");
        require(!info.isCompleted, "Step already completed");

        info.isCompleted = true;
        stepToComplete -= 1;
    }

    function updateStepInfoGrade(uint256 _stepId, StepGrade _grade) public {
        StepDetails storage info = stepInfo[_stepId];
        require(info.isCompleted, "Step not completed");
        info.stepGrade = _grade;
    }

    function updateReputation(uint256 _stepId) internal {
        StepDetails storage info = stepInfo[_stepId];
        require(stepToComplete == 0, "Process not completed");
        require(!info.fin, "Already updated");

        int256 reputation = HRS.getUserReputation();

        if (info.stepGrade == StepGrade.A) {
            reputation += 10;
        } else if (info.stepGrade == StepGrade.B) {
            reputation += 5;
        } else if (info.stepGrade == StepGrade.C) {
            reputation += 2;
        } else if (info.stepGrade == StepGrade.F) {
            reputation -= 10;
        } else {
            revert("Invalid grade");
        }

        info.DonorReputation = reputation;
        info.fin = true;

        HRS.modifyReputation(info.user, reputation);
    }

    function processComplete(uint256 _finalStepId) public {
        require(stepToComplete == 0, "Not all steps completed");
        updateReputation(_finalStepId);
        // TODO: integrate NFT minting logic for `nftReceipt`
    }

    function setStepsToComplete(uint256 _stepToComplete) public {
        stepToComplete = _stepToComplete;
    }

    function setReceiptAddress(address _newNFTReceipt) public {
        nftReceipt = _newNFTReceipt;
    }
}
