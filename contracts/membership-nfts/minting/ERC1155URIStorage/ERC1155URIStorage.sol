// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155URIStorage is ERC1155 {
    mapping (uint => string) private _tokenURIs;

    function uri(uint tokenId) public view override virtual returns(string memory tokenURI) {
        return _tokenURIs[tokenId];
    }

    function uris(uint[] calldata tokenIds) public view virtual returns(string[] memory tokenURIs) {
        string[] memory _tokensURIs = new string[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            _tokensURIs[i] = uri(tokenId);
        }

        return _tokensURIs;
    }

    function _setURI(uint tokenId, string memory tokenURI) internal virtual {
        require(bytes(tokenURI).length > 0, "URIStorage: Invalid tokenURI");

        _tokenURIs[tokenId] = tokenURI;

        emit URI(tokenURI, tokenId);
    }
}
