// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

using HRSStorage for Set global;

struct Set {
    address avs;
    uint256 id;
}

library HRSStorage {
    function key(Set memory os) internal pure returns (bytes32) {
        return bytes32(abi.encodePacked(os.avs, uint96(os.id)));
    }

    function decode(bytes32 _key) internal pure returns (Set memory) {
        return Set({avs: address(uint160(uint256(_key) >> 96)), id: uint32(uint256(_key) & type(uint96).max)});
    }
}
