// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

import "./ERC1155KnownTokens.sol";

contract ERC1155KnownTokens_Wrapper is ERC1155(""), ERC1155KnownTokens {
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155KnownTokens) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function beforeTokenTransfer(address from, address to, uint256[] calldata ids, uint256[] calldata amounts) public virtual {
        _beforeTokenTransfer(_msgSender(), from, to, ids, amounts, "");
    }
}
