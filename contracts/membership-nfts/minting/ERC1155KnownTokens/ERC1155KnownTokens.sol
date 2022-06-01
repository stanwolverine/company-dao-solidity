// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155KnownTokens is Ownable, ERC1155 {
    mapping(uint256 => string) private _tokens;
    uint256 private _totalTokens;

    function tokens() public view virtual returns(string[] memory) {
        string[] memory nftsList = new string[](_totalTokens);

        for (uint256 i = 0; i < _totalTokens; i++) {
            nftsList[i] = _tokens[i + 1];
        }

        return nftsList;
    }

    function addToken(string calldata tokenName) public virtual onlyOwner returns(uint256 newTokenId) {
        _totalTokens += 1;

        uint newNFTId = _totalTokens;

        _tokens[newNFTId] = tokenName;

        return newNFTId;
    }

    function isTokenKnown(string calldata tokenName) public view virtual returns(bool isTokenApproved, uint256 tokenId) {
        bytes32 tokenNameInBytes = keccak256(abi.encodePacked(tokenName));

        for (uint256 i = 1; i <= _totalTokens; i++) {
            string memory currentTokenName = _tokens[i];

            if (keccak256(abi.encodePacked(currentTokenName)) == tokenNameInBytes) {
                return (true, i);
            }
        }

        return (false, 0);
    }

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
        // to -> no restriction
        // ids -> must be a known id
        // amount -> no restriction

        // Perform checks only when minting token
        // token is being minted if "from" is zero address
        if (from == address(0)) {
            
            for (uint256 i = 0; i < ids.length; i++) {
                uint256 tokenId = ids[i];

                // If token name is not valid, throw error
                require(bytes(_tokens[tokenId]).length > 0, "ERC1155KnownTokens: Unknown TokenId");
            }
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

}
