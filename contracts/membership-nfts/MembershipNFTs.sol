//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "./minting/ERC1155URIStorage/ERC1155URIStorage.sol";

contract MembershipNFTs is ERC1155(""), ERC1155URIStorage {
    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns(string memory tokenURI) {
        return super.uri(tokenId);
    }
}

