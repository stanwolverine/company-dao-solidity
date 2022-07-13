// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC1155MaxSupply.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155MaxSupplyWrapper is ERC1155(""), ERC1155MaxSupply {
    function setMaxSupply(uint256 tokenId, uint256 maxSupplyAmount) public virtual {
        super._setMaxSupply(tokenId, maxSupplyAmount);
    }

    function beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual {
        _beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155MaxSupply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
