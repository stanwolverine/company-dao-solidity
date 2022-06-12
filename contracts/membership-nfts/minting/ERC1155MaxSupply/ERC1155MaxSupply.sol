// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

abstract contract ERC1155MaxSupply is Ownable, ERC1155Supply {
    mapping(uint256 => uint256) private _maxSupply;

    event MaxSupply(uint256 tokenId, uint256 maxSupply);

    /**
        @notice Max Supply of token with id `id`
        @param tokenId id of token
        @return max supply of token
     */
    function maxSupply(uint256 tokenId) public view virtual returns (uint256) {
        return _maxSupply[tokenId];
    }

    /**
        @notice set max supply for token with id `id`,
            emits MaxSupply event with id and max supply amount
        @param tokenId id of token
        @param maxSupplyAmount max supply for token
     */
    function _setMaxSupply(uint256 tokenId, uint256 maxSupplyAmount) internal virtual onlyOwner {
        _maxSupply[tokenId] = maxSupplyAmount;

        emit MaxSupply(tokenId, maxSupplyAmount);
    }

    /**
     * @dev See {ERC1155-_beforeTokenTransfer}.
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        if (from == address(0)) {
            for (uint256 i = 0; i < ids.length; ++i) {
                uint256 tokenId = ids[i];
                uint256 mintAmount = amounts[i];

                require((totalSupply(tokenId) + mintAmount) <= maxSupply(tokenId), "MaxSupply: exceeding max supply");
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
