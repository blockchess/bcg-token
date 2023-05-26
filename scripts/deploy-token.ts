import { ethers } from "hardhat";
import { BCT } from "../typechain-types/contracts/BCT";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BCTFactory = await ethers.getContractFactory("BCT");
  const BCT = (await BCTFactory.deploy()) as BCT;

  await BCT.deployed();

  console.log("BCT deployed: ", BCT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
