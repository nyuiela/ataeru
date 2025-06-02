// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../permissions/callable.sol";
import "../core/EntryPoint.sol";
import "../dataTypes/HRSstorage.sol";
import "./HospitalRequestContract.sol";
import "../dataTypes/hrsdataset.sol";

contract HRC is Callable,  HRSDataStorage {
    EntryPoint public entry;
    HospitalRequestContract public requestContract;

    using HRSStorage for Set;
    using EnumerableSet for EnumerableSet.Bytes32Set;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct SetParam {
        address hrs;
        uint256 id;
        bytes32 data;
    }

    mapping(uint256 => Booking) public registeredBooking;
    mapping(address => EnumerableSet.Bytes32Set) internal registeredSet;
    //mapping(bytes32 => EnumerableSet.AddressSet) internal _setMembers;
    mapping(address => EnumerableSet.Bytes32Set) internal _sets;
    mapping(address => bool) public isRegisteredToHRS;
    mapping(address => int256) public userToRepuation;
   // mapping(address => mapping(bytes32 => RegistrationStatus)) public registrationStatus;

    struct Booking {
        bytes32 id;
        address user;
        bool isBooked;
        uint256 createdAt;
    }

   

    event RegisteredWithHRC(address indexed _user, uint256 indexed _id, address indexed _hrs);
    event BookingRequested(address indexed user, bytes32 indexed id, uint256 indexed rid);
    event BookingCancelled(address indexed user, bytes32 indexed id, uint256 indexed rid);
    event BookingAcceptedOrRejected(address indexed user, uint256 indexed rid);
    event SetAdded(address indexed _hrs, uint256 indexed _id, bytes32 data);
    event SetRemoved(address indexed _hrs, uint256 indexed _id);

    constructor(address _entryPoint, address _requestContract) {
        entry = EntryPoint(_entryPoint);
        requestContract = HospitalRequestContract(_requestContract);
    }

    function registerWithHRC(address user, uint256 _id, address _hrs) public checkCanCall(msg.sender) {
        Set memory set = Set({avs: _hrs, id: _id});
        bytes32 _key = set.key();
        require(_sets[_hrs].contains(_key), "HRS__Set does not exist");
        isRegisteredToHRS[msg.sender] = true;
        emit RegisteredWithHRC(user, _id, _hrs);
    }

    function requestBooking(bytes32 _id, uint256 _rid) public checkCanCall(msg.sender) {
        require(entry.isregistered(), "HRS__User must be registered");
        require(requestContract.isRequestExist(_rid), "HRS__Request does not exist");
        require(!requestContract.requestMaxDonor(_rid), "HRS__Request has max donors");

        registeredBooking[_rid] = Booking({
            id: _id,
            user: msg.sender,
            isBooked: true,
            createdAt: block.timestamp
        });

        emit BookingRequested(msg.sender, _id, _rid);
    }

    function cancelBooking(bytes32 _id, uint256 _rid) public checkCanCall(msg.sender) {
        require(entry.isregistered(), "HRS__User must be registered");
        require(requestContract.isRequestExist(_rid), "HRS__Request does not exist");

        registeredBooking[_rid] = Booking({
            id: _id,
            user: msg.sender,
            isBooked: false,
            createdAt: block.timestamp
        });

        emit BookingCancelled(msg.sender, _id, _rid);
    }

    function getBooking(uint256 _rid) public view returns (Booking memory) {
        return registeredBooking[_rid];
    }

    function acceptOrRejectBooking(address user, uint256 _rid, uint256 _id, SetParam memory setParam) public checkCanCall(msg.sender) {
        require(getBooking(_rid).isBooked, "HRS__Booking is not booked");
        _addToSet(user, _id, msg.sender, setParam);
        emit BookingAcceptedOrRejected(user, _rid);
    }

    function _addToSet(address _user, uint256 _id, address _hrs, SetParam memory setParam) public checkCanCall(msg.sender) {
        require(entry.isregistered(), "HRS__User is not registered");

        Set memory set = Set({avs: _hrs, id: _id});
        bytes32 _key = set.key();

        registeredSet[_user].add(_key);
        _setMembers[_key].add(_user);

        registrationStatus[_user][_key].isRegistered = true;
        registerWithHRC(_user, set.id, set.avs);
        userToRepuation[_user] = 50;

        emit SetAdded(set.avs, set.id, setParam.data);
    }

    function removeFromSet(address _user,  address _hrs, uint256 _setId) public checkCanCall(msg.sender) {
        Set memory set = Set({avs: _hrs, id: _setId});
        bytes32 _key = set.key();

        require(_sets[set.avs].contains(_key), "HRS__Set does not exist");
        registeredSet[_user].remove(_key);
        _setMembers[_key].remove(_user);

        emit SetRemoved(set.avs, set.id);
    }

    function isMemberOfSet(address _user, bytes32 _key) public view returns (bool) {
        return _setMembers[_key].contains(_user) && isRegisteredToHRS[_user];
    }

    function getUserReputation() public view returns (int256) {
        return userToRepuation[msg.sender];
    }

    function modifyReputation(address user, int256 newReputation) public checkCanCall(msg.sender) {
        userToRepuation[user] = newReputation;
    }
}