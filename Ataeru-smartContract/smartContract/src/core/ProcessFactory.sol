// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Process.sol";

contract ProcessFactoryContract {
    using Clones for address;
Process processContract;
// RequestContract requestContract
// let kaleel help with this
//clone requests
// uint256 steptsToComplete;
// address nftReceipt;
// address HRS;

    constructor(address _contract, address _nftReceipt, address _HRS, uint256 _steptsToComplete)  {
        processContract = Process(_contract.clone());
        processContract.initialize(_nftReceipt, _HRS, _steptsToComplete);
    }
    


} 