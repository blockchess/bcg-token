import { ethers } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BCT } from "../typechain-types/contracts/BCT";

describe("Token Contract", async () => {
  let signers: SignerWithAddress[];
  let BCT: BCT;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    // Get owner as signer, account as customer
    signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];

    // Deploy smart contract
    const BCTFactory = await ethers.getContractFactory("BCT");
    BCT = (await BCTFactory.deploy()) as BCT;
    await BCT.deployed();
  });

  it('Started total supply MUST BE equal to "0"', async () => {
    expect(await BCT.totalSupply()).equal("0");
  });

  describe("Mint", () => {
    const amountToMint = 10000;
    beforeEach(async () => {
      // mint amountToMint tokens
      await BCT.mint(amountToMint, owner.address);
    });

    it('"totalSupply" MUST BE equal to "amountToMint"', async () => {
      expect(await BCT.totalSupply()).equal(amountToMint);
    });

    it('"Owner" MUST HAVE balance equal to "amountToMint"', async () => {
      expect(await BCT.balanceOf(owner.address)).equal(amountToMint);
    });
  });

  describe("Mint over cap", () => {
    it('MUST revert with "BEP20: cap exceeded"', async () => {
      // get total cap
      const cap = await BCT.cap();

      // mint more than total cap
      await expect(BCT.mint(cap + 1, owner.address)).to.be.revertedWith("BEP20: cap exceeded");
    });
  });
});
