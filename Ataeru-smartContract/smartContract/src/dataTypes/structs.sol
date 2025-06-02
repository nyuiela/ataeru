//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

abstract contract Structs {
    struct DonorInfo {
        string name;
        string email;
        string bloodGroup;
        string location;
        uint256 age;
        uint256 weight;
        uint256 height;
        uint256 contact;
        string about;
        bytes32 witnessHash; // health document hash
        DonorType donorType;
        address donor;
    }

    enum DonorType {
        SPERMDONOR,
        EGGDONOR,
        SURROGATE
    }

    struct HospitalRequest {
        //    uint256 id;
        // address hospitalAddress;
        DonorType donorType;
        string rules;
        uint256 date;
        uint256 time;
        uint256 maxDonors;
        uint256 minAmontpayment;
        uint256 maxAmountPayment;
        RequestStatus status;
        string requestDescription;
        bool isActive;
    }

    enum RequestStatus {
        URGENT,
        NORMAL
    }

    struct UserInfo {
        string name;
        string email;
        string location;
        uint256 contact;
        string about;
        bytes32 witnessHash; // health document hash
      //  bool isUserRegistered;
        //ReceiverType receiverType;
        address user;
    }

    enum ReceiverType {
        SPERMRECEIVER,
        EGGRECEIVER,
        SURROGATERECEIVER
    }

    struct HospitalInfo {
        string name;
        string email;
        string location;
        uint256 contact;
        string about;
        bytes32 witnessHash; // health document hash
      //  bool isHospital;
      address hospitalAddress;
      address requests;
      
    }

    struct DonorSet {
        address hospital;
        address donor;
        bool isregisterset;
    }

    struct UserSet {
        address hospital;
        address user;
        bool isregisterset;
    }

    struct AgentInfo {
        string nameOfAgent;
        string description;
        uint256 nftId;
        //  bool isDeployedAgent;
        ActivityConfinment activity;
        AgentStatus status;
    }

    enum AgentStatus {
        PENDING,
        DEPLOYED,
        CANCELLED
    }

    enum ActivityConfinment {
        NONE,
        BOOKING,
        FULL,
        VERIFYAUTHENTICITY
    }
}
