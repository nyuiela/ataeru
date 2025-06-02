// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../core/HRS.sol";
import "../dataTypes/RewardDataType.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract RewardContract is RewardDataType {
    using SafeERC20 for IERC20;

constructor(address _HRS) {
        HRS = HRC(_HRS);
    }
    HRC public HRS;
    function earned(uint256 _epoch, address _token) public {
        int256 reputation = HRS.getUserReputation();
        if(reputation < 0){
            return;
        }
        uint256 rewardPerShare = rewardToEpoch[_token][_epoch].rewardPerShare;

        userToEpoch[msg.sender][_epoch] = UserReward({
            lastTimeClaimed: block.timestamp,
            reputationPoint: uint256(reputation),
            rewardsearned:  uint256(reputation) * rewardPerShare 
        });
    }

    function addRewardMultiple(RewardData[] memory rewardDatas) public returns (uint256[] memory _epochNumbers) {
        uint256 length = rewardDatas.length;
        _epochNumbers = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            _epochNumbers[i] = addReward(rewardDatas[i]);
        }
    }

    function addReward(RewardData memory rewardData) public returns (uint256 _epochNumber) {
        require(
            rewardData.startTime >= block.timestamp && rewardData.endTime > rewardData.startTime,
            "Reward__Invalid_time"
        );

        uint256 duration = rewardData.endTime - rewardData.startTime;
        uint256 rewardPerSecond = rewardData.totalReward / duration;
        uint256 usedReward = rewardPerSecond * duration;

        address token = rewardData._tokenAddress;
        _epochNumber = epochNumber++;
        
        rewardToEpoch[token][_epochNumber] = RewardData({
            totalReward: usedReward,
            lastTimeUpdated: block.timestamp,
            rewardPerShare: rewardPerSecond,
            _tokenAddress: token,
            startTime: rewardData.startTime,
            endTime: rewardData.endTime
        });

        if (!hasBeenUsedBefore[token]) {
            rewardTokens.push(token);
            hasBeenUsedBefore[token] = true;
        }

        IERC20(token).safeTransferFrom(msg.sender, address(this), usedReward);
    }

    function claim(uint256 _epoch, address _token) public {
        earned(_epoch, _token);
        uint256 rewardsForUser = userToEpoch[msg.sender][_epoch].rewardsearned;

        RewardData storage rewardEpoch = rewardToEpoch[_token][_epoch];
        require(rewardsForUser > 0, "Rewards__NothingToClaim");
        require(rewardEpoch.totalReward >= rewardsForUser, "Rewards__InsufficientPool");

        rewardEpoch.totalReward -= rewardsForUser;
        IERC20(_token).safeTransfer(msg.sender, rewardsForUser);
    }

    function getRewardAddress() public view returns (address[] memory) {
        return rewardTokens;
    }
}
