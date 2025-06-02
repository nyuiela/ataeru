// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

interface IFixedPointOracle {
    function price() external view returns (uint256);
}
