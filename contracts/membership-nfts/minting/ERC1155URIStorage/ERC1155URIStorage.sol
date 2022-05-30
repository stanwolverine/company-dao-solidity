// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155URIStorage is ERC1155 {
    mapping (uint => string) private _tokenURIs;

    function uri(uint tokenId) public view override virtual returns(string memory) {
        return _tokenURIs[tokenId];
    }

    function _setURI(uint tokenId, string memory tokenURI) internal virtual {
        require(bytes(tokenURI).length > 0, "Invalid tokenURI");

        _tokenURIs[tokenId] = tokenURI;

        emit URI(tokenURI, tokenId);
    }
}
