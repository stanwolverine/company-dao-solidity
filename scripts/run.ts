import hre from "hardhat";

async function main() {
  try {
    const CompanyNFT = await hre.ethers.getContractFactory("CompanyNFT");
    const companyNFT = await CompanyNFT.deploy();

    await companyNFT.deployed();

    let uri = await companyNFT.uri(0);
    console.log(uri);

    await companyNFT.mint(
      5,
      "ipfs://bafyreigwncrq2mfm6sc6mgsacovdekonzpdzlr7op6kpo2z2his7cqj2ne/metadata.json"
    );

    uri = await companyNFT.uri(0);
    console.log(uri);
  } catch (error) {}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
