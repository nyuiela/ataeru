// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./HospitalRequestContract.sol";

contract HospitalRequestFactoryContract {
    using Clones for address;

    HospitalRequestContract public requestContract;

    constructor(address _contract, address _hospitalAddress, uint256 _maxDonor) {
        address clone = _contract.clone();
        requestContract = HospitalRequestContract(clone);
        requestContract.initialize(_hospitalAddress, _maxDonor);
    }

    function cloneHospitalRequest(
        address _hospitalAddress,
        uint256 _maxDonor
    ) public returns (address) {
        address clone = address(requestContract).clone();
        HospitalRequestContract(clone).initialize(_hospitalAddress, _maxDonor);
        return clone;
    }
}


