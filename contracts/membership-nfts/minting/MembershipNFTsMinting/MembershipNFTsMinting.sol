// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../ERC1155URIStorage/ERC1155URIStorage.sol";
import "../ERC1155KnownTokens/ERC1155KnownTokens.sol";
import "../ERC1155MaxSupply/ERC1155MaxSupply.sol";

abstract contract MembershipNFTsMinting is ERC1155URIStorage, ERC1155KnownTokens, ERC1155MaxSupply {
    /**
        @inheritdoc ERC1155URIStorage
     */
    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns(string memory tokenURI) {
        return super.uri(tokenId);
    }

    /**
        @notice changes uri of the known token
        @param tokenId id of token
        @param tokenURI new uri for token
     */
    function changeTokenURI(uint256 tokenId, string calldata tokenURI) public virtual onlyOwner {
        require(isTokenKnown(tokenId), "NFTsMinting: Unknown Id");

        _setURI(tokenId, tokenURI);
    }

    /**
        @notice changes max supply of the known token
        @param tokenId id of token
        @param newMaxSupply new max supply
     */
    function changeMaxSupply(uint256 tokenId, uint256 newMaxSupply) public virtual onlyOwner {
        require(isTokenKnown(tokenId), "NFTsMinting: Unknown Id");

        _setMaxSupply(tokenId, newMaxSupply);
    }

    /**
        @notice add new known token,
            uri for it,
            and max circulating supply
        @param tokenURI uri for the new token
        @return tokenId id of the new known token
     */
    function addNewToken(string calldata tokenURI, uint256 newMaxSupply) public virtual onlyOwner returns(uint256 tokenId) {
        uint256 newTokenId = _addKnownToken();

        changeTokenURI(newTokenId, tokenURI);
        changeMaxSupply(newTokenId, newMaxSupply);

        return newTokenId;
    }

    /**
        @inheritdoc ERC1155KnownTokens
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155KnownTokens, ERC1155MaxSupply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
