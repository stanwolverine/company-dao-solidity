import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

describe("ERC1155KnownTokens", () => {
  describe("Transactions", () => {
    let ERC1155KnownTokensWrapperFactory: any;
    let ERC1155KnownTokensWrapper: any;
    let add1: SignerWithAddress;

    beforeEach(async () => {
      const signers = await ethers.getSigners();
      add1 = signers[1];

      ERC1155KnownTokensWrapperFactory = await ethers.getContractFactory(
        "ERC1155KnownTokens_Wrapper"
      );

      ERC1155KnownTokensWrapper =
        await ERC1155KnownTokensWrapperFactory.deploy();

      await ERC1155KnownTokensWrapper.deployed();
    });

    it("Should give all approved tokens", async () => {
      expect(await ERC1155KnownTokensWrapper.tokens()).to.deep.equal([]);

      const tokenNames = ["TestToken1", "TestToken2"];

      for await (const tokenName of tokenNames) {
        const firstTxn = await ERC1155KnownTokensWrapper.addToken(tokenName);

        await firstTxn.wait();
      }

      expect(await ERC1155KnownTokensWrapper.tokens()).to.deep.equal(
        tokenNames
      );
    });

    it("Should revert `_beforeTokenTransfer` transaction, when called with unapproved token", async () => {
      await expect(
        ERC1155KnownTokensWrapper.beforeTokenTransfer(
          ethers.constants.AddressZero,
          add1.address,
          [1],
          [100]
        )
      ).to.be.revertedWith("ERC1155KnownTokens: Unknown TokenId");

      const txn = await ERC1155KnownTokensWrapper.addToken("TestToken");

      await txn.wait();

      await expect(
        ERC1155KnownTokensWrapper.beforeTokenTransfer(
          ethers.constants.AddressZero,
          add1.address,
          [1],
          [100]
        )
      ).not.to.be.revertedWith("ERC1155KnownTokens: Unknown TokenId");
    });

    describe("Token Approval", () => {
      it("Should approve a token", async () => {
        const tokenName = "TestToken";

        await ERC1155KnownTokensWrapper.addToken(tokenName);

        const [isTokenKnown, tokenId]: [boolean, BigNumber] =
          await ERC1155KnownTokensWrapper.isTokenKnown(tokenName);

        expect(isTokenKnown).to.equal(true);
        expect(tokenId.eq(1)).to.equal(true);
      });

      it("Should not approve a token, if called by non-owner", async () => {
        const tokenName = "TestToken";

        await expect(
          ERC1155KnownTokensWrapper.connect(add1).addToken(tokenName)
        ).to.be.revertedWith("Ownable: caller is not the owner");
      });
    });
  });
});
