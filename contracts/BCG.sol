// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BCG is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint256 private immutable _cap;

    constructor() ERC20("BlockChess Game", "BCG") ERC20Permit("BCG") {
        _cap = 100_000_000 * 10 ** decimals();
    }

    function mint(uint256 amount, address target) external onlyOwner {
        require(totalSupply() + amount <= _cap, "BCG: cap exceeded");
        _mint(target, amount);
    }

    function cap() external view returns (uint256) {
        return _cap;
    }

    function getOwner() external view returns (address) {
        return owner();
    }
}
