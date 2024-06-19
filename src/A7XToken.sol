// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";

contract A7XToken is ERC20 {
    address private owner;

    constructor() ERC20("A7XToken", "A7X", 10, 1000000 * 10 ** 10) {
        owner = msg.sender;
    }

    function test() public pure returns (string memory) {
        return "test";
    }

    function buy(uint _amount) public  {
        require(_amount > 0, "Invalid amount");
        require(_amount < 1000, "Too High amount");
        _mint(msg.sender, _amount);
    }
}