//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./permissionstoragetypes.sol";
import "../dataTypes/errors.sol";

contract Callable is PermissionStorage, ErrorStuff {
    using EnumerableSet for EnumerableSet.AddressSet;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    modifier onlyAdmin() {
        if (!isAdmin(msg.sender,msg.sender)) {
            revert NotAdmin();
        }
        _;
    }

 modifier checkCanCall(
        address account
    ) {
        require(_checkCanCall(account), InvalidPermissions());
        _;
    }

  
   
    function addPendingAdmin(address account, address admin) external onlyAdmin {
        AccountPermissions storage permissions = _permissions[account];

        // Revert if the admin is already set
        require(!permissions.admins.contains(admin), AdminAlreadySet());

        // Add the admin to the account's pending admins
        // If the admin is already pending, the add will fail
        require(permissions.pendingAdmins.add(admin), AdminAlreadyPending());

        emit PendingAdminAdded(account, admin);
    }

    event PendingAdminAdded(address indexed _account, address indexed owner);

    function removePendingAdmin(address account, address admin) external onlyAdmin {
        EnumerableSet.AddressSet storage pendingAdmins = _permissions[account].pendingAdmins;

        // Remove the admin from the account's pending admins
        // Revert if the admin is not pending
        require(pendingAdmins.remove(admin), AdminNotPending());

        emit PendingAdminRemoved(account, admin);
    }

    event PendingAdminRemoved(address indexed _account, address indexed owner);

    function acceptAdmin(address account) external {
        AccountPermissions storage permissions = _permissions[account];

        // Remove the admin from the pending list
        // Revert if the admin is not pending
        require(permissions.pendingAdmins.remove(msg.sender), AdminNotPending());

        // Add the admin to the account's admins
        // Not wrapped in a require since it must be the case the admin is not one
        permissions.admins.add(msg.sender);

        emit AdminSet(account, msg.sender);
    }

    event AdminSet(address indexed _account, address indexed owner);

    function removeAdmin(address account, address admin) external onlyAdmin {
        EnumerableSet.AddressSet storage admins = _permissions[account].admins;

        require(admins.length() > 1, CannotHaveZeroAdmins());

        // Remove the admin from the account's admins
        // If the admin is not set, the remove will fail
        require(admins.remove(admin), AdminNotSet());

        emit AdminRemoved(account, admin);
    }

    event AdminRemoved(address indexed _account, address indexed owner);

    function setAppointee(address account, address appointee, address target, bytes4 selector)
        external
        onlyAdmin
    {
        AccountPermissions storage permissions = _permissions[account];

        bytes32 targetSelector = _encodeTargetSelector(target, selector);
        require(!permissions.appointeePermissions[appointee].contains(targetSelector), AppointeeAlreadySet());

        // Add the appointee to the account's permissions
        permissions.appointeePermissions[appointee].add(targetSelector);
        permissions.permissionAppointees[targetSelector].add(appointee);

        emit AppointeeSet(account, appointee, target, selector);
    }

    event AppointeeSet(address indexed _account, address indexed _apointer, address indexed _target, bytes4 _sel);

    function removeAppointee(address account, address appointee, address target, bytes4 selector)
        external
        onlyAdmin
    {
        AccountPermissions storage permissions = _permissions[account];

        bytes32 targetSelector = _encodeTargetSelector(target, selector);
        require(permissions.appointeePermissions[appointee].contains(targetSelector), AppointeeNotSet());

        // Remove the appointee from the account's permissions
        permissions.appointeePermissions[appointee].remove(targetSelector);
        permissions.permissionAppointees[targetSelector].remove(appointee);

        emit AppointeeRemoved(account, appointee, target, selector);
    }

    event AppointeeRemoved(address indexed _account, address indexed _apointer, address indexed _target, bytes4 _sel);
    /**
     *
     *                         INTERNAL FUNCTIONS
     *
     */

    function _encodeTargetSelector(address target, bytes4 selector) internal pure returns (bytes32) {
        // Reserve 96 bits for the target
        uint256 shiftedTarget = uint256(uint160(target)) << 96;
        // Reserve 32 bits for the selector
        uint256 shiftedSelector = uint256(uint32(selector)) << 64;
        // Combine the target and selector
        return bytes32(shiftedTarget | shiftedSelector);
    }

    function _decodeTargetSelector(bytes32 targetSelector) internal pure returns (address, bytes4) {
        // The target is in the upper 160 bits of the targetSelector
        address target = address(uint160(uint256(targetSelector) >> 96));
        // The selector is in the lower 32 bits after the padding is removed
        bytes4 selector = bytes4(uint32(uint256(targetSelector) >> 64));

        return (target, selector);
    }

    function isAdmin(address account, address caller) public view returns (bool) {
        if (_permissions[account].admins.length() == 0) {
            // If the account does not have an admin, the caller must be the account
            return account == caller;
        } else {
            // If the account has an admin, the caller must be an admin
            return _permissions[account].admins.contains(caller);
        }
    }

    function isPendingAdmin(address account, address pendingAdmin) external view returns (bool) {
        return _permissions[account].pendingAdmins.contains(pendingAdmin);
    }

    function getAdmins(address account) external view returns (address[] memory) {
        if (_permissions[account].admins.length() == 0) {
            address[] memory admin = new address[](1);
            admin[0] = account;
            return admin;
        } else {
            return _permissions[account].admins.values();
        }
    }

    function getPendingAdmins(address account) external view returns (address[] memory) {
        return _permissions[account].pendingAdmins.values();
    }

    function canCall(address account, address caller, address target, bytes4 selector) public view returns (bool) {
        return isAdmin(account, caller)
            || _permissions[account].appointeePermissions[caller].contains(_encodeTargetSelector(target, selector));
    }

 function _checkCanCall(
        address account
    ) internal view returns (bool) {
        return canCall(account, msg.sender, address(this), msg.sig);
    }
    
    function getAppointeePermissions(address account, address appointee)
        external
        view
        returns (address[] memory, bytes4[] memory)
    {
        EnumerableSet.Bytes32Set storage appointeePermissions = _permissions[account].appointeePermissions[appointee];

        uint256 length = appointeePermissions.length();

        address[] memory targets = new address[](length);
        bytes4[] memory selectors = new bytes4[](length);

        for (uint256 i = 0; i < length; ++i) {
            (targets[i], selectors[i]) = _decodeTargetSelector(appointeePermissions.at(i));
        }

        return (targets, selectors);
    }

    function getAppointees(address account, address target, bytes4 selector) external view returns (address[] memory) {
        bytes32 targetSelector = _encodeTargetSelector(target, selector);
        return _permissions[account].permissionAppointees[targetSelector].values();
    }

    
}
