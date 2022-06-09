import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract, ContractFactory, Event } from "ethers";
import { ethers } from "hardhat";

describe("MembershipNFTsMinting", () => {
  describe("Transactions", () => {
    let MembershipNFTsMintingWrapperFactory: ContractFactory;
    let MembershipNFTsMintingWrapper: Contract;
    let add1: SignerWithAddress;

    beforeEach(async () => {
      MembershipNFTsMintingWrapperFactory = await ethers.getContractFactory(
        "MembershipNFTsMintingWrapper"
      );

      MembershipNFTsMintingWrapper =
        await MembershipNFTsMintingWrapperFactory.deploy();

      await MembershipNFTsMintingWrapper.deployed();

      add1 = (await ethers.getSigners())[1];
    });

    describe("when called by owner", () => {
      it("Should add new mintable token with uri", async () => {
        // arrange
        const newTokenURI = "first-token-uri";

        // act
        const txn = await MembershipNFTsMintingWrapper.addNewToken(newTokenURI);

        const approvedTxn = await txn.wait();

        const newKnownTokenEvent: Event | undefined = approvedTxn.events.find(
          (event: Event) => event.event === "NewKnownToken"
        );

        // assert
        expect(newKnownTokenEvent).to.be.ok;
        expect(newKnownTokenEvent?.args).to.be.ok;

        expect(newKnownTokenEvent?.args?.[0].eq(1)).to.equal(true);

        const newTokenId = (
          newKnownTokenEvent?.args?.[0] as BigNumber
        ).toNumber();

        expect(
          await MembershipNFTsMintingWrapper.isTokenKnown(newTokenId)
        ).to.be.equal(true);

        expect(await MembershipNFTsMintingWrapper.uri(newTokenId)).to.equal(
          newTokenURI
        );
      });

      it("Should change uri of token when token is known", async () => {
        // arrange
        const tokenURI = "token-uri";
        const changedTokenURI = "changed-token-uri";

        // act
        const addTxn = await MembershipNFTsMintingWrapper.addNewToken(tokenURI);
        await addTxn.wait();

        const originalURI = await MembershipNFTsMintingWrapper.uri(1);

        const changeTxn = await MembershipNFTsMintingWrapper.changeTokenURI(
          1,
          changedTokenURI
        );
        await changeTxn.wait();

        const changedURI = await MembershipNFTsMintingWrapper.uri(1);

        // assert
        expect(originalURI).to.equal(tokenURI);
        expect(changedURI).to.equal(changedTokenURI);
      });
    });

    describe("When called by non-owner", () => {
      const onlyOwnerErrorText = "Ownable: caller is not the owner";

      it("Should revert `add new mintable token with uri` transaction", async () => {
        // arrange
        const newTokenURI = "first-token-uri";

        // act & assert
        await expect(
          MembershipNFTsMintingWrapper.connect(add1).addNewToken(newTokenURI)
        ).to.be.revertedWith(onlyOwnerErrorText);
      });

      it("Should revert `change uri of token` transaction when token is known", async () => {
        // arrange
        const tokenURI = "token-uri";
        const changedTokenURI = "changed-token-uri";

        // act
        const addTxn = await MembershipNFTsMintingWrapper.addNewToken(tokenURI);
        await addTxn.wait();

        // assert
        await expect(
          MembershipNFTsMintingWrapper.connect(add1).changeTokenURI(
            1,
            changedTokenURI
          )
        ).to.be.revertedWith(onlyOwnerErrorText);
      });
    });

    it("Should revert `change uri` transaction when token is unknown", async () => {
      // arrange
      const tokenURI = "token-uri";

      // act & assert
      await expect(
        MembershipNFTsMintingWrapper.changeTokenURI(1, tokenURI)
      ).to.be.revertedWith("NFTsMinting: Unknown Id");
    });
  });
});
