// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155URIStorage is ERC1155 {
    mapping (uint => string) private _tokenURIs;

    /**
        @notice returns metadata `uri` for a given token id
        @dev This implementation does not relies on the token type ID substitution mechanism
            https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
        @param tokenId id of token
        @return tokenURI uri of token with id `id`
     */
    function uri(uint tokenId) public view override virtual returns(string memory tokenURI) {
        return _tokenURIs[tokenId];
    }

    /**
        @notice returns list of uri for given list of `ids`
        @param tokenIds list of token ids
        @return tokenURIs list of token uris
     */
    function uris(uint[] calldata tokenIds) public view virtual returns(string[] memory tokenURIs) {
        string[] memory _tokensURIs = new string[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            _tokensURIs[i] = uri(tokenId);
        }

        return _tokensURIs;
    }

    /**
        @notice sets uri for given token id
        @dev uri must be valid string,
            emits URI event
        @param tokenId id of token
        @param tokenURI uri of token id
    */
    function _setURI(uint tokenId, string memory tokenURI) internal virtual {
        require(bytes(tokenURI).length > 0, "URIStorage: Invalid tokenURI");

        _tokenURIs[tokenId] = tokenURI;

        emit URI(tokenURI, tokenId);
    }
}
