// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BCT is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint256 private _cap;

    constructor() ERC20("BlockChess Token", "BCT") ERC20Permit("BCT") {
        _cap = 100_000_000 * 10 ** 18;
    }

    function mint(uint256 amount, address target) external onlyOwner {
        require(totalSupply() + amount <= _cap, "BEP20: cap exceeded");
        _mint(target, amount);
    }

    function cap() external view returns (uint256) {
        return _cap;
    }
}
