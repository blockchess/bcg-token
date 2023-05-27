import { ethers } from "hardhat";
import { BCG } from "../typechain-types/contracts/BCG";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BCGFactory = await ethers.getContractFactory("BCG");
  const BCG = (await BCGFactory.deploy()) as BCG;

  await BCG.deployed();

  console.log("BCG deployed: ", BCG.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
