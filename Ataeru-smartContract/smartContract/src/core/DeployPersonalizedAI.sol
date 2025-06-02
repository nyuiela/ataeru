// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "./NftContract.sol";
import "../dataTypes/datastructures.sol";
import "../permissions/callable.sol";
import "../core/HRS.sol";
import "../core/VerificationOfParties.sol";
import "./AgentFactory.sol";

contract AiAgent is DataStructures {
    ProfileImageNfts internal mft;
    AiAgentFactory agentFactory;
    Callable public canCall;
    HRC public hrs;
    VerificationOfParties public vop;

    bool public isAgent;

    // Ensure this is inherited from DataStructures or defined here:
    // mapping(address => mapping(address => AgentInfo)) public agents;

    constructor(address _hrs, address _vop, address _agentFactory) {
        hrs = HRC(_hrs);
        vop = VerificationOfParties(_vop);
       agentFactory = AiAgentFactory(_agentFactory);
    }
error onlyFactoryCanCall();
    modifier onlyFactory() {
        if(msg.sender != address(agentFactory)){
            revert onlyFactoryCanCall();
        }
        _;
    }

//Only factory or whatever 
    function deployAiAgent(
        uint256 nftId,
        string memory agentName,
        string memory _des,
        ActivityConfinment _act,
        address _agentAddress
    ) public onlyFactory {
        require(mft.ownerOf(nftId) == msg.sender, "You are not the owner of this NFT");

        // agentAddress = address(new AiAgent(address(hrs), address(vop)));

         agents[msg.sender][_agentAddress] = AgentInfo({
            nameOfAgent: agentName,
            description: _des,
            activity: _act,
            nftId: nftId,
            status: AgentStatus.DEPLOYED
        });

       

       // agents[msg.sender][agentAddress] = agentInfo;
        isAgent = true;

        _addAgentPermission(msg.sender, _agentAddress, _act);

       
    }

    function cancelAgent(address agentAddress) public {
        require(
            agents[msg.sender][agentAddress].status == AgentStatus.DEPLOYED,
            "Agent is not deployed"
        );
        agents[msg.sender][agentAddress].status = AgentStatus.CANCELLED;
    }

    function reactivateAgent(address agentAddress) public {
        require(
            agents[msg.sender][agentAddress].status == AgentStatus.CANCELLED,
            "Agent is not cancelled"
        );
        agents[msg.sender][agentAddress].status = AgentStatus.DEPLOYED;
    }

    function updateAgent(
        address agentAddress,
        string memory agentName,
        string memory _des,
        ActivityConfinment _act
    ) public {
        AgentInfo storage agent = agents[msg.sender][agentAddress];
        ActivityConfinment currentActivity = agent.activity;

        require(currentActivity != _act, "Agent already has this activity");
        require(agent.status == AgentStatus.DEPLOYED, "Agent is not deployed");

        _removeAgentPermission(msg.sender, agentAddress, currentActivity);

        agent.nameOfAgent = agentName;
        agent.description = _des;
        agent.activity = _act;

        _addAgentPermission(msg.sender, agentAddress, _act);
    }

    function getAgentInfo(address agentAddress) public view returns (AgentInfo memory) {
        return agents[msg.sender][agentAddress];
    }

    function getAgentPermission(address agentAddress)
        public
        view
        returns (ActivityConfinment)
    {
        return agents[msg.sender][agentAddress].activity;
    }

    function _addAgentPermission(
        address user,
        address agentAddress,
       ActivityConfinment activity
    ) internal {
        if (activity == ActivityConfinment.BOOKING) {
            canCall.setAppointee(user, agentAddress, address(hrs), HRC.requestBooking.selector);
        }
        if (activity == ActivityConfinment.FULL) {
            canCall.addPendingAdmin(user, agentAddress);
        }
        if (activity == ActivityConfinment.VERIFYAUTHENTICITY) {
            canCall.setAppointee(user, agentAddress, address(vop), vop.verifyAiAgent.selector);
        }
    }

    function _removeAgentPermission(
        address user,
        address agentAddress,
       ActivityConfinment activity
    ) internal {
        if (activity == ActivityConfinment.BOOKING) {
            canCall.removeAppointee(user, agentAddress, address(hrs), HRC.requestBooking.selector);
        }
        if (activity == ActivityConfinment.FULL) {
            canCall.removeAdmin(user, agentAddress);
        }
        if (activity == ActivityConfinment.VERIFYAUTHENTICITY) {
            canCall.removeAppointee(user, agentAddress, address(vop), vop.verifyAiAgent.selector);
        }
    }
}
