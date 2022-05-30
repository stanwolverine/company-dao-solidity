import { ethers } from "hardhat";
import { expect } from "chai";

describe("MembershipNFTs", () => {
  let MembershipNFTsFactory: any;
  let membershipNFTs: any;

  beforeEach(async () => {
    MembershipNFTsFactory = await ethers.getContractFactory("MembershipNFTs");
    membershipNFTs = await MembershipNFTsFactory.deploy();

    await membershipNFTs.deployed();
  });

  describe("Transactions", async () => {
    it("Should return invalid tokenURI for unknown token", async () => {
      expect(await membershipNFTs.uri(0)).to.equal("");
    });
  });
});
