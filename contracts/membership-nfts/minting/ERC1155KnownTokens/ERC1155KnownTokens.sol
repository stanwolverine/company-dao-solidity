// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155KnownTokens is Ownable, ERC1155 {
    /**
        @dev first approved token id will be `1`,
            last id will be incremented by `1` to approve new token.
            `0` is not valid as a token id
     */
    uint256 private _lastKnownTokenId;

    /// @dev number by which token id will be incremented
    uint256 constant private TOKEN_ID_INCREMENT_STEP = 1;

    /**
        @notice returns first and last known token ids respectively
        @dev initial ids will be (0, 0),
            after adding first known token, ids will be (1, 1)
            after adding second known token, ids will be (1, 2)
        @return firstApprovedTokenId first known token id, lastApprovedTokenId last known token id
     */
    function firstAndLastTokenIds() public view virtual returns(uint256 firstApprovedTokenId, uint256 lastApprovedTokenId) {
        uint256 firstKnownTokenId = _lastKnownTokenId > 0 ? TOKEN_ID_INCREMENT_STEP : 0;

        return (firstKnownTokenId, _lastKnownTokenId);
    }

    /**
        @notice returns true if given token id is known, otherwise false
        @dev `0` is not approved as a known token id
        @param tokenId id of token
        @return isTokenApproved boolean to represet token id known status
     */
    function isTokenKnown(uint256 tokenId) public view virtual returns(bool isTokenApproved) {
        return tokenId > 0 && tokenId <= _lastKnownTokenId;
    }

    /**
        @notice adds one more known token id
        @dev increments _lastKnownTokenId by TOKEN_ID_INCREMENT_STEP
        @return newTokenId new added known token id
    */
    function _addKnownToken() internal virtual onlyOwner returns(uint256 newTokenId) {
        _lastKnownTokenId += TOKEN_ID_INCREMENT_STEP;

        return _lastKnownTokenId;
    }

    /**
        @notice reverts the `minting transaction` if any given `id` in `ids` is unknown
        @inheritdoc ERC1155
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        // CURRENT STATUS:
        // operator -> no restriction
        // from -> from must be address(0)
        // ids -> must be a known id
        // amount -> no restriction

        // Perform checks only when minting token
        // token is being minted if "from" is zero address
        if (from == address(0)) {
            
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 tokenId = ids[i];

                // If token name is not valid, throw error
                require(isTokenKnown(tokenId), "KnownTokens: Unknown TokenId");
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
