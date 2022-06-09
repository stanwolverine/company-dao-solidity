// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MembershipNFTsMinting.sol";

contract MembershipNFTsMintingWrapper is ERC1155(""), MembershipNFTsMinting {
    /// @inheritdoc MembershipNFTsMinting
    function uri(uint256 tokenId) public view override(ERC1155, MembershipNFTsMinting) returns(string memory tokenURI) {
        return super.uri(tokenId);
    }

    /// @inheritdoc MembershipNFTsMinting
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, MembershipNFTsMinting) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
