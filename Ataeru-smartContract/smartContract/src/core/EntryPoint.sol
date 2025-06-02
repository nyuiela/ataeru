// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../dataTypes/structs.sol";
import "../dataTypes/datastructures.sol";
import "./HospitalRequestFactory.sol";

contract EntryPoint is DataStructures {
   
   address[] public  hospitalRequests;
HospitalRequestFactoryContract public requestFactory;

 mapping( bytes32 =>address ) public hospitalAddressTorequestAddress;
    constructor(address _requestFactory) {
        requestFactory = HospitalRequestFactoryContract(_requestFactory);
       
    }
    event DonorRegistered(
        address indexed _donor,
        string _name,
        string _email,
        string _bloodGroup,
        string _location,
        uint256 _age,
        uint256 _weight,
        uint256 _height,
        uint256 _contact,
        string _about,
        bytes32 _witnessHash,
        DonorType _donorType,
        bytes32 indexed dId
    );

    function registerDonor(
        string memory _name,
        string memory _email,
        string memory _bloodGroup,
        string memory _location,
        uint256 _age,
        uint256 _weight,
        uint256 _height,
        uint256 _contact,
        string memory _about,
        bytes32 _witnessHash,
        DonorType _donorType
    ) public returns (bytes32 _dId) {
        require(!isDonor[msg.sender], "Donor already registered");

        DonorInfo memory donor = DonorInfo(
            _name, _email, _bloodGroup, _location, _age, _weight, _height, _contact, _about, _witnessHash, _donorType, msg.sender
        );
        _dId = keccak256(abi.encode(donor));
        isDonor[msg.sender] = true;
        donors[_dId] = donor;
      //  registeredDonor[msg.sender][_dId][true] = donor;

        emit DonorRegistered(
            msg.sender,
            _name,
            _email,
            _bloodGroup,
            _location,
            _age,
            _weight,
            _height,
            _contact,
            _about,
            _witnessHash,
            _donorType,
            _dId
        );

        return _dId;
    }

    event UserRegistered(
        address indexed _user,
        string _name,
        string _email,
        string _location,
        uint256 _contact,
        string _about,
        bytes32 _witnessHash,
      
        bytes32 indexed uId
    );

    function registerUser(
        string memory _name,
        string memory _email,
        string memory _location,
        uint256 _contact,
        string memory _about,
        bytes32 _witnessHash 
    ) public returns (bytes32 _uId) {
        require(!isUser[msg.sender], "User already registered");

        UserInfo memory user = UserInfo(_name, _email, _location, _contact, _about, _witnessHash,  msg.sender);
        _uId = keccak256(abi.encode(user));
        isUser[msg.sender] = true;
        registeredUser[msg.sender] = user;

        emit UserRegistered(msg.sender, _name, _email, _location, _contact, _about, _witnessHash,  _uId);
        return _uId;
    }

    event HospitalRegistered(address indexed _hospital, bytes32 indexed hId);

    function registerHospital(
        address _ha,
        string memory _name,
        string memory _email,
        string memory _location,
        string memory _about,
        uint256 _contact,
        bytes32 _witnessHash
    ) public returns (bytes32 _hID) {
        require(!isHospital[_ha], "Hospital already registered");
       address requestaddress = requestFactory.cloneHospitalRequest(_ha, 5);
       hospitalRequests.push(requestaddress);
        HospitalInfo memory hospital = HospitalInfo(_name, _email, _location, _contact, _about, _witnessHash,_ha, requestaddress);
        _hID = keccak256(abi.encode(hospital));
        isHospital[_ha] = true;
        registeredHospital[_ha] = hospital;
        //hospital address to their request addres to get all
        hospitalAddressTorequestAddress[_hID]= requestaddress;
        hospitalList.push(hospital);
        emit HospitalRegistered(_ha, _hID);
        return _hID;
    }


    function getHospitalList() public view returns (HospitalInfo[] memory) {
        return hospitalList;
    }

   

    event DonorDeregistered(address indexed _donor, bytes32 indexed dId);

    function deregisterDonor(bytes32 _diD) public {
        require(isDonor[msg.sender], "Not registered as donor");
        delete registeredDonor[msg.sender][_diD][true];
        isDonor[msg.sender] = false;
        emit DonorDeregistered(msg.sender, _diD);
    }

    event UserDeregistered(address indexed _user, bytes32 indexed uId);

    function deregisterUser(bytes32 _uID) public {
        require(isUser[msg.sender], "Not registered as user");
        delete registeredUser[msg.sender];
        isUser[msg.sender] = false;
        emit UserDeregistered(msg.sender, _uID);
    }

    event HospitalDeregistered(address indexed _hospital, bytes32 indexed hId);

    function deregisterHospital() public {
        require(isHospital[msg.sender], "Not registered as hospital");
        delete registeredHospital[msg.sender];
        isHospital[msg.sender] = false;
      //   emit HospitalDeregistered(msg.sender, "");
    }

    event DonorUpdated(
        address indexed _donor,
        string _name,
        string _email,
        string _bloodGroup,
        string _location,
        uint256 _age,
        uint256 _weight,
        uint256 _height,
        uint256 _contact,
        string _about,
        DonorType _donorType,
        bytes32 indexed dId
    );

    function updateDonorInfomation(
        bytes32 _diD,
        string memory _name,
        string memory _email,
        string memory _bloodGroup,
        string memory _location,
        uint256 _age,
        uint256 _weight,
        uint256 _height,
        uint256 _contact,
        string memory _about,
        DonorType _donorType,
        address add__
    ) public {
        DonorInfo storage donor = donors[_diD];
        donor.name = _name;
        donor.email = _email;
        donor.bloodGroup = _bloodGroup;
        donor.location = _location;
        donor.age = _age;
        donor.weight = _weight;
        donor.height = _height;
        donor.contact = _contact;
        donor.about = _about;
        donor.donorType = _donorType;
        donor.donor = add__;

        emit DonorUpdated(msg.sender, _name, _email, _bloodGroup, _location, _age, _weight, _height, _contact, _about, _donorType, _diD);
    }

    event UserUpdated(
        address indexed _user,
        string _name,
        string _email,
        string _location,
        uint256 _contact,
        string _about,
      
        bytes32 indexed uId
    );

    function updateUserInfomation(
        bytes32 _uID,
        string memory _name,
        string memory _email,
        string memory _location,
        uint256  _contact,
        string memory _about,
        
        address add__
    ) public {
        UserInfo storage user = registeredUser[msg.sender];
        user.name = _name;
        user.email = _email;
        user.location = _location;
        user.contact = _contact;
        user.about = _about;
       user.user = add__;

        emit UserUpdated(msg.sender, _name, _email, _location, _contact, _about, _uID);
    }

    event HospitalUpdated(string _name, string _email, string _location, uint256 _contact, string _about, bytes32 _hID);

    function updateHospitalInfomation(
        address _add,
        bytes32 _hID,
        string memory _name,
        string memory _email,
        string memory _location,
        string memory _about,
        uint256 _contact
    ) public {
        HospitalInfo storage hospital = registeredHospital[msg.sender];
        hospital.name = _name;
        hospital.email = _email;
        hospital.location = _location;
        hospital.about = _about;
        hospital.hospitalAddress = _add;
        hospital.contact = _contact;

        emit HospitalUpdated(_name, _email, _location, _contact, _about, _hID);
    }

    function isregistered() public view returns (bool) {
        return isDonor[msg.sender] || isUser[msg.sender] || isHospital[msg.sender];
    }

    // function getUsernDonorInfo(bytes32 _id) public view returns (DonorInfo memory, UserInfo memory) {
    //     return (registeredDonor[msg.sender][_id][true], registeredUser[msg.sender][_id]);
    // } //@audit change seperate 
    
    function getUserInfo() public view returns(UserInfo memory){
        return registeredUser[msg.sender];
    }

    function getDonorInfo(bytes32 _id) public view returns(DonorInfo memory){
         return  donors[_id];
    }

    function gethospitalinfo(address _owner) public view returns (HospitalInfo memory) {
        return registeredHospital[_owner];
    }
    function getHospitalToRequest(bytes32 _hId) public view returns(address ){
     return   hospitalAddressTorequestAddress[_hId];
    }
    function getRequestAddress() public view returns(address[] memory){
        return hospitalRequests;
    }

}
