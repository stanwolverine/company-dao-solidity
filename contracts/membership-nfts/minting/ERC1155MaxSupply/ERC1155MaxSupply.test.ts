import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155MaxSupply", () => {
  describe("Transactions", () => {
    let ERC1155MaxSupplyWrapperFactory: any;
    let ERC1155MaxSupplyWrapper: any;
    let owner: SignerWithAddress;
    let add1: SignerWithAddress;

    beforeEach(async () => {
      ERC1155MaxSupplyWrapperFactory = await ethers.getContractFactory(
        "ERC1155MaxSupplyWrapper"
      );
      ERC1155MaxSupplyWrapper = await ERC1155MaxSupplyWrapperFactory.deploy();

      await ERC1155MaxSupplyWrapper.deployed();

      const signers = await ethers.getSigners();
      owner = signers[0];
      add1 = signers[1];
    });

    it("Should return max supply of token", async () => {
      // arrange
      const intialMaxSupply = await ERC1155MaxSupplyWrapper.maxSupply(0);

      // act
      const txn = await ERC1155MaxSupplyWrapper.setMaxSupply(0, 500);
      await txn.wait();

      // assert
      expect(intialMaxSupply).to.equal(0);
      expect(await ERC1155MaxSupplyWrapper.maxSupply(0)).to.equal(500);
    });

    it("Should `set max supply` for token when called by owner", async () => {
      // arrange
      const maxSupply = 500;

      // act & assert
      await expect(ERC1155MaxSupplyWrapper.setMaxSupply(0, maxSupply))
        .to.emit(ERC1155MaxSupplyWrapper, "MaxSupply")
        .withArgs(0, maxSupply);

      expect(await ERC1155MaxSupplyWrapper.maxSupply(0)).to.equal(500);
    });

    it("Should revert `set max supply` transaction when called by non-owner", async () => {
      // act & assert
      await expect(
        ERC1155MaxSupplyWrapper.connect(add1).setMaxSupply(0, 500)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert `token mint` transaction when mint amount will exceed max supply of token", async () => {
      // act & assert
      await expect(
        ERC1155MaxSupplyWrapper.beforeTokenTransfer(
          owner.address,
          ethers.constants.AddressZero,
          add1.address,
          [1],
          [500],
          []
        )
      ).to.be.revertedWith("MaxSupply: exceeding max supply");
    });

    it("Should allow `token mint` when mint amount will not exceed max supply of token", async () => {
      // act
      const txn = await ERC1155MaxSupplyWrapper.setMaxSupply(0, 501);
      await txn.wait();

      // assert
      await expect(
        ERC1155MaxSupplyWrapper.beforeTokenTransfer(
          owner.address,
          ethers.constants.AddressZero,
          add1.address,
          [0],
          [501],
          []
        )
      ).not.to.be.reverted;
    });
  });
});
