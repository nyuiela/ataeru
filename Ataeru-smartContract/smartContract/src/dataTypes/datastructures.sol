//SPDX-License_Identifier: MIT
pragma solidity 0.8.26; 

import "./structs.sol";

contract DataStructures is Structs{

  
         mapping(bytes32 => DonorInfo) public donors;
        mapping(address => UserInfo) public users;
        mapping(address => HospitalInfo) public hospitals;
        HospitalInfo[] public hospitalList;
        mapping(address => mapping(address => DonorSet))public  donorSets;
        mapping(address => mapping(address => UserSet)) public userSets;
        mapping(address => mapping(address => AgentInfo)) public agents;
        mapping(address => mapping(bytes32 => mapping(bool => DonorInfo)))public  registeredDonor;
       // mapping(address => mapping())
        mapping(address => UserInfo) public registeredUser;
        mapping(address => HospitalInfo) public registeredHospital;
        // bool isDonor;
        // bool isHospital;
        // bool isUser;
         mapping(address => bool) public isDonor;
    mapping(address => bool) public isUser;
    mapping(address => bool) public isHospital;
}