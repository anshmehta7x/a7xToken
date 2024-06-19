// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {A7XToken} from "../src/A7XToken.sol";

contract A7XTokenTest is Test {
    A7XToken public counter;

    function setUp() public {
        counter = new A7XToken();
    }

}
