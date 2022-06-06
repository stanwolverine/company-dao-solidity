import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

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

    it("Should return correct first and last known token ids", async () => {
      // act
      const [initialFirstTokenId, initialLastTokenId]: BigNumber[] =
        await ERC1155KnownTokensWrapper.firstAndLastTokenIds();

      const firstTxn = await ERC1155KnownTokensWrapper.addKnownToken();
      await firstTxn.wait();

      const [firstTokenIdv1, lastTokenIdv1]: BigNumber[] =
        await ERC1155KnownTokensWrapper.firstAndLastTokenIds();

      const secondTxn = await ERC1155KnownTokensWrapper.addKnownToken();
      await secondTxn.wait();

      // assert
      expect(initialFirstTokenId.eq(BigNumber.from(0))).to.equal(true);
      expect(initialLastTokenId.eq(BigNumber.from(0))).to.equal(true);

      expect(firstTokenIdv1.eq(BigNumber.from(1))).to.equal(true);
      expect(lastTokenIdv1.eq(BigNumber.from(1))).to.equal(true);

      const [firstTokenIdv2, lastTokenIdv2]: BigNumber[] =
        await ERC1155KnownTokensWrapper.firstAndLastTokenIds();

      expect(firstTokenIdv2.eq(BigNumber.from(1))).to.equal(true);
      expect(lastTokenIdv2.eq(BigNumber.from(2))).to.equal(true);
    });

    it("Should add new known token when called by owner", async () => {
      // act
      await ERC1155KnownTokensWrapper.addKnownToken();

      const isTokenKnown = await ERC1155KnownTokensWrapper.isTokenKnown(1);

      // assert
      expect(isTokenKnown).to.equal(true);
    });

    it("Should revert `add new known token` transaction when called by non-owner", async () => {
      // assert
      await expect(
        ERC1155KnownTokensWrapper.connect(add1).addKnownToken()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should return false when given token id is unknown", async () => {
      // assert
      expect(await ERC1155KnownTokensWrapper.isTokenKnown(1)).to.equal(false);
    });

    it("Should return true when given token id is known", async () => {
      // act
      const txn = await ERC1155KnownTokensWrapper.addKnownToken();

      await txn.wait();

      // assert
      expect(await ERC1155KnownTokensWrapper.isTokenKnown(1)).to.equal(true);
    });

    it("Should revert token mint transaction when token being minted is unknown", async () => {
      await expect(
        ERC1155KnownTokensWrapper.beforeTokenTransfer(
          ethers.constants.AddressZero,
          add1.address,
          [1],
          [100]
        )
      ).to.be.revertedWith("KnownTokens: Unknown TokenId");
    });

    it("Should allow token mint when token being minted is known", async () => {
      // act
      const txn = await ERC1155KnownTokensWrapper.addKnownToken();

      await txn.wait();

      // assert
      await expect(
        ERC1155KnownTokensWrapper.beforeTokenTransfer(
          ethers.constants.AddressZero,
          add1.address,
          [1],
          [100]
        )
      ).not.to.be.revertedWith("KnownTokens: Unknown TokenId");
    });
  });
});
