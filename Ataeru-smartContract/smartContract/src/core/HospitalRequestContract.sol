// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../dataTypes/structs.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//import "@openzeppelin/contracts/proxy/Clones.sol";

contract HospitalRequestContract is Initializable {
    uint256 public id;
    address public hospitalAddress;
    Structs.HospitalRequest public hospitalRequest;
    uint256 maxDonor;

    mapping(address => mapping(uint256 => Structs.HospitalRequest)) public hospitalRequests;

    function initialize(address _hospitalAddress, uint256 _maxDonor) public initializer {
        hospitalAddress = _hospitalAddress;
        maxDonor = _maxDonor;
    }

    function makeADonorRequest(
        Structs.DonorType _donorType,
        string memory _rules,
        uint256 _date,
        uint256 _time,
        uint256 _maxDonor,
        uint256 _minAmount,
        uint256 _maxAmount,
        Structs.RequestStatus _status,
        string memory _des
    ) public returns (uint256 _id) {
        hospitalRequest = Structs.HospitalRequest(
            _donorType, _rules, _date, _time, _maxDonor, _minAmount, _maxAmount, _status, _des, true
        );

        id = id + 1;
        hospitalRequests[hospitalAddress][id] = hospitalRequest;
        return id;
    }

    function makeMultipleDonorRequest(
        Structs.DonorType[] memory _donorType,
        string[] memory _rules,
        uint256[] memory _date,
        uint256[] memory _time,
        uint256[] memory _maxDonor,
        uint256[] memory _minAmount,
        uint256[] memory _maxAmount,
        Structs.RequestStatus[] memory _status,
        string[] memory _des
    ) public returns (uint256 _id) {
        
    //      require(
    //     _donorType.length == _rules.length &&
    //     _rules.length == _date.length &&
    //     _date.length == _time.length &&
    //     _time.length == _maxDonor.length &&
    //     _maxDonor.length == _minAmount.length &&
    //     _minAmount.length == _maxAmount.length &&
    //     _maxAmount.length == _status.length &&
    //     _status.length == _des.length,
    // );

    for (uint256 i = 0; i < _donorType.length; i++) {
         hospitalRequest = Structs.HospitalRequest({
            donorType: _donorType[i],
            rules: _rules[i],
            date: _date[i],
            time: _time[i],
            maxDonors: _maxDonor[i],
           minAmontpayment: _minAmount[i],
            maxAmountPayment: _maxAmount[i],
            status: _status[i],
        requestDescription: _des[i],
            isActive: true
        });

        hospitalRequests[msg.sender][id] = hospitalRequest; // Save request
            _id = id + 1;
            hospitalRequests[hospitalAddress][id] = hospitalRequest;

            return _id;
        }
    }

    function isRequestExpired(uint256 _id) public view returns (bool) {
        if (hospitalRequests[hospitalAddress][_id].date > block.timestamp) {
            return true;
        }
        return false;
    }

    function requestMaxDonor(uint256 _id) public view returns (bool) {
        return hospitalRequests[hospitalAddress][_id].maxDonors == maxDonor;
    }

    function isRequestExist(uint256 _id) public view returns (bool) {
        if (hospitalRequests[hospitalAddress][_id].isActive == true) {
            return true;
        }
        return false;
    }

    function getRequest(uint256 _id) public view returns (Structs.HospitalRequest memory) {
        return hospitalRequests[hospitalAddress][_id];
    }
}
