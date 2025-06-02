// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

abstract contract RewardDataType {
    address[] internal rewardTokens;
    uint256 internal epochNumber;

    struct RewardData {
        uint256 totalReward;
        uint256 lastTimeUpdated;
        uint256 rewardPerShare;
        address _tokenAddress;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(address => mapping(uint256 => RewardData)) internal rewardToEpoch;
    mapping(address => bool) public hasBeenUsedBefore;

    struct UserReward {
        uint256 lastTimeClaimed;
        uint256 reputationPoint;
        uint256 rewardsearned;
    }

    mapping(address => mapping(uint256 => UserReward)) internal userToEpoch;
}
