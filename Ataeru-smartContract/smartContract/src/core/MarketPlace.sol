// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "../Interface/IFixedPointedOracle.sol";
import "../core/HealthDataNFT.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MarketPlace is IERC721Receiver {
    using SafeERC20 for IERC20;

    IFixedPointOracle public oracle;
    HealthDataNFT public healthDataNFT;
    IERC20 public stableToken; // token used for buying NFTs

    uint256 public saleEpoch = 1;
    uint256[] public nftsOnSale;

    struct NFTSellDetails {
        address nftOwner;
        uint256 setTimeStamp;
        uint256 price;
        uint256 saleEpoch;
        string uri;
        bool sold;
    }

    //  mapping(uint256 => NFTSellDetails) public displayDetails;
    NFTSellDetails[] public displayDetails;

    constructor(address _healthDataNFT, address _stableToken, address _oracle) {
        healthDataNFT = HealthDataNFT(_healthDataNFT);
        stableToken = IERC20(_stableToken);
        oracle = IFixedPointOracle(_oracle);
    }

    function sell(uint256 _nftId, uint256 price) external {
        require(
            healthDataNFT.ownerOf(_nftId) == msg.sender,
            "Not owner of NFT"
        );
        healthDataNFT.safeTransferFrom(msg.sender, address(this), _nftId);
        string memory uri = healthDataNFT.tokenURI(_nftId);

        NFTSellDetails memory newNft = NFTSellDetails({
            nftOwner: msg.sender,
            setTimeStamp: block.timestamp,
            price: price,
            saleEpoch: saleEpoch++,
            uri: uri,
            sold: false
        });
        displayDetails.push(newNft);
    }

    function buy(uint256 _nftId) external {
        NFTSellDetails storage details = displayDetails[_nftId];
        require(!details.sold, "Already sold");
        require(details.saleEpoch != 0, "NFT not for sale");

        details.sold = true;

        stableToken.safeTransferFrom(
            msg.sender,
            details.nftOwner,
            details.price
        );
        healthDataNFT.safeTransferFrom(address(this), msg.sender, _nftId);
    }

    function getNftDetails() external view returns (NFTSellDetails[] memory) {
        return displayDetails;
    }

    function getOnSale() external view returns (uint256[] memory) {
        return nftsOnSale;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
