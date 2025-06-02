// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileImageNfts is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIds = 0;
    mapping(uint256 => string) private _tokenURIs;

    struct RenderToken {
        uint256 id;
        string uri;
        string space;
    }

    constructor() ERC721("ProfileImageNfts", "PIN") Ownable(msg.sender) {}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        //  require(_exists(tokenId), "URI does not exist for this ID");
        return _tokenURIs[tokenId];
    }

    // whats the goal/task here...    people can store their nft and use it as profile picture if they want Heyyyyyy
    // okay so a dynamic way
    // heyyyyy,
    function mint(address recipient, string memory _uri) public returns (uint256) {
        uint256 newId = _tokenIds;
        _tokenIds++;

        _mint(recipient, newId);
        _setTokenURI(newId, _uri);

        return newId;
    }

    function isOwnerOFToken(uint256 tokenId) public view returns (bool) {
        address _owner = ownerOf(tokenId);
        return _owner == msg.sender;
    }
}
