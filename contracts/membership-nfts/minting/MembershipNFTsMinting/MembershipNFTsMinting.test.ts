import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
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
      it("Should add new mintable token with uri and max supply", async () => {
        // arrange
        const newTokenURI = "first-token-uri";
        const newMaxSupply = 500;

        // act
        const txn = await MembershipNFTsMintingWrapper.addNewToken(
          newTokenURI,
          newMaxSupply
        );

        const approvedTxn = await txn.wait();

        // assert
        expect(approvedTxn).to.have.emittedWithArgs("NewKnownToken", {
          tokenId: 1,
        });

        expect(approvedTxn).to.have.emittedWithArgs("MaxSupply", {
          tokenId: 1,
          maxSupply: newMaxSupply,
        });

        expect(approvedTxn).to.have.emittedWithArgs("URI", {
          id: 1,
          value: newTokenURI,
        });

        expect(await MembershipNFTsMintingWrapper.isTokenKnown(1)).to.be.equal(
          true
        );

        expect(await MembershipNFTsMintingWrapper.uri(1)).to.equal(newTokenURI);

        expect(await MembershipNFTsMintingWrapper.maxSupply(1)).to.equal(
          newMaxSupply
        );
      });

      describe("When token is known", async () => {
        it("Should change uri of token", async () => {
          // arrange
          const tokenURI = "token-uri";
          const maxSupply = 500;
          const changedTokenURI = "changed-token-uri";

          // act
          const addTxn = await MembershipNFTsMintingWrapper.addNewToken(
            tokenURI,
            maxSupply
          );
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

        it("Should change max supply of token", async () => {
          // arrange
          const tokenURI = "token-uri";
          const maxSupply = 500;
          const newMaxSupply = 700;

          // act
          const addTxn = await MembershipNFTsMintingWrapper.addNewToken(
            tokenURI,
            maxSupply
          );
          await addTxn.wait();

          const originalMaxSupply =
            await MembershipNFTsMintingWrapper.maxSupply(1);

          const changeTxn = await MembershipNFTsMintingWrapper.changeMaxSupply(
            1,
            newMaxSupply
          );
          await changeTxn.wait();

          const changedMaxSupply = await MembershipNFTsMintingWrapper.maxSupply(
            1
          );

          // assert
          expect(originalMaxSupply).to.equal(maxSupply);
          expect(changedMaxSupply).to.equal(newMaxSupply);
        });
      });
    });

    describe("When called by non-owner", () => {
      const onlyOwnerErrorText = "Ownable: caller is not the owner";

      it("Should revert `add new mintable token with uri` transaction", async () => {
        // arrange
        const newTokenURI = "first-token-uri";
        const newMaxSupply = 500;

        // act & assert
        await expect(
          MembershipNFTsMintingWrapper.connect(add1).addNewToken(
            newTokenURI,
            newMaxSupply
          )
        ).to.be.revertedWith(onlyOwnerErrorText);
      });

      it("Should revert `change uri of token` transaction when token is known", async () => {
        // arrange
        const tokenURI = "token-uri";
        const maxSupply = 500;
        const changedTokenURI = "changed-token-uri";

        // act
        const addTxn = await MembershipNFTsMintingWrapper.addNewToken(
          tokenURI,
          maxSupply
        );
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

    describe("When token is unknown", async () => {
      const unknownIdError = "NFTsMinting: Unknown Id";

      it("Should revert `change uri` transaction", async () => {
        // arrange
        const tokenURI = "token-uri";

        // act & assert
        await expect(
          MembershipNFTsMintingWrapper.changeTokenURI(1, tokenURI)
        ).to.be.revertedWith(unknownIdError);
      });

      it("Should revert `change max supply` transaction", async () => {
        // arrange
        const maxSupply = 500;

        // act & assert
        await expect(
          MembershipNFTsMintingWrapper.changeMaxSupply(1, maxSupply)
        ).to.be.revertedWith(unknownIdError);
      });
    });
  });
});
