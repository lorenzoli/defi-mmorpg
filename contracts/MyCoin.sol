pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract MyCoin is ERC20, Ownable {
    constructor() ERC20("My Coin", "MYC") {}

    function balanceMyCoin() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function myAddr() public view returns (address) {
        return msg.sender;
    }
}
