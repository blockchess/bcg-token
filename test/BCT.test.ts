import { ethers } from "hardhat";
import { expect } from "chai";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BCG } from "../typechain-types/contracts/BCG";

describe("BSG Token Contract", async () => {
  let signers: SignerWithAddress[];
  let BCG: BCG;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;

  beforeEach(async () => {
    // get owner as signer, account as customer
    signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];

    // deploy smart contract
    const BCGFactory = await ethers.getContractFactory("BCG");
    BCG = (await BCGFactory.deploy()) as BCG;
    await BCG.deployed();
  });

  it('Started total supply MUST BE equal to "0"', async () => {
    expect(await BCG.totalSupply()).equal("0");
  });

  it('Cap MUST BE equal to "100000000000000000000000000"', async () => {
    expect(await BCG.cap()).equal("100000000000000000000000000");
  });

  it("Started owner MUST BE equal to deployer", async () => {
    expect(await BCG.owner()).equal(owner.address);
    expect(await BCG.getOwner()).equal(owner.address);
  });

  it('Name MUST BE equal to "BlockChess Game"', async () => {
    expect(await BCG.name()).equal("BlockChess Game");
  });

  it('Symbol MUST BE equal to "BCG"', async () => {
    expect(await BCG.symbol()).equal("BCG");
  });

  it('Decimals MUST BE equal to "18"', async () => {
    expect(await BCG.decimals()).equal(18);
  });

  describe("Token minting", () => {
    const amountToMint = 10000;

    it('"totalSupply" MUST BE equal to minted amount', async () => {
      await BCG.mint(amountToMint, owner.address);
      expect(await BCG.totalSupply()).equal(amountToMint);

      await BCG.mint(amountToMint, owner.address);
      expect(await BCG.totalSupply()).equal(amountToMint * 2);
    });

    it('"totalSupply" MUST decrease on burning', async () => {
      await BCG.mint(amountToMint, owner.address);
      expect(await BCG.totalSupply()).equal(amountToMint);

      await BCG.burn(amountToMint / 2);
      expect(await BCG.totalSupply()).equal(amountToMint - amountToMint / 2);
    });

    it('"Owner" MUST HAVE balance equal to minted amount', async () => {
      await BCG.mint(amountToMint, owner.address);

      expect(await BCG.balanceOf(owner.address)).equal(amountToMint);
    });

    it("Any target MUST HAVE balance equal to minted amount", async () => {
      await BCG.mint(amountToMint, user.address);

      expect(await BCG.balanceOf(user.address)).equal(amountToMint);
    });

    it("MUST revert if the minter is not owner", async () => {
      await expect(BCG.connect(user).mint(amountToMint, owner.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
      await expect(BCG.connect(user).mint(amountToMint, user.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("MUST revert if the cap is over", async () => {
      // get total cap
      const cap = await BCG.cap();

      // mint more than total cap
      await expect(BCG.mint(cap.add(1), owner.address)).to.be.revertedWith("BCG: cap exceeded");
      await expect(BCG.mint(cap.add(100), owner.address)).to.be.revertedWith("BCG: cap exceeded");
      await expect(BCG.mint(cap.add(100000000000), owner.address)).to.be.revertedWith("BCG: cap exceeded");

      // mint equal to total cap
      await BCG.mint(cap, owner.address);

      // mint total cap + 1
      await expect(BCG.mint(1, owner.address)).to.be.revertedWith("BCG: cap exceeded");
    });
  });
});
