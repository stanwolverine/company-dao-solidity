// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./ERC1155URIStorage.sol";

contract ERC1155URIStorage_Wrapper is ERC1155(""), ERC1155URIStorage {
    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns(string memory tokenURI) {
        return super.uri(tokenId);
    }

    function setURI(uint256 tokenId, string calldata tokenURI) public {
        return _setURI(tokenId, tokenURI);
    }
}
