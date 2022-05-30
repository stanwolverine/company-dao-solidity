import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC1155URIStorage", () => {
  describe("Transactions", () => {
    let URIStorageFactory: any;
    let uriStorage: any;

    beforeEach(async () => {
      URIStorageFactory = await ethers.getContractFactory(
        "ERC1155URIStorage_Wrapper"
      );
      uriStorage = await URIStorageFactory.deploy();

      await uriStorage.deployed();
    });

    it("Should not have uri for unknown token ids", async () => {
      expect(await uriStorage.uri(0)).to.equal("");
      expect(await uriStorage.uri(1)).to.equal("");
    });

    it("Should set uri for token ids", async () => {
      const zeroTokenIdURI = "uri-for-token-with-id-0";
      const setURITx1 = await uriStorage.setURI(0, zeroTokenIdURI);

      await setURITx1.wait();

      const oneTokenIdURI = "uri-for-token-with-id-1";
      const setURITx2 = await uriStorage.setURI(1, oneTokenIdURI);

      await setURITx2.wait();

      const threeTokenIdURI = "uri-for-token-with-id-3";
      const setURITx3 = await uriStorage.setURI(3, threeTokenIdURI);

      await setURITx3.wait();

      expect(await uriStorage.uri(0)).to.equal(zeroTokenIdURI);
      expect(await uriStorage.uri(1)).to.equal(oneTokenIdURI);
      expect(await uriStorage.uri(3)).to.equal(threeTokenIdURI);
    });

    it("Should emit `URI` event after setting token uri", async () => {
      const zeroTokenIdURI = "uri-for-token-with-id-0";

      await expect(uriStorage.setURI(0, zeroTokenIdURI))
        .to.emit(uriStorage, "URI")
        .withArgs(zeroTokenIdURI, 0);
    });

    it("Should revert txn if uri is invalid", async () => {
      const invalidURI = "";

      await expect(uriStorage.setURI(0, invalidURI)).to.be.revertedWith(
        "Invalid tokenURI"
      );
    });
  });
});
