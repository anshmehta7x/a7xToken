// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";

contract A7XToken is ERC20 {
    address private owner;
    mapping(address => uint) private stakedTokens;
    mapping(address => bool) private isStaking;
    mapping(address => uint) private stakingTime;

    event TokensBought(address indexed buyer, uint amount);
    event TokensStaked(address indexed staker, uint amount);
    event StakeWithdrawn(address indexed staker, uint amount, uint reward);

    constructor() ERC20("A7XToken", "A7X", 10, 1000000 * 10 ** 10) {
        owner = msg.sender;
    }

    function test() public pure returns (string memory) {
        return "test";
    }

    function buy(uint _amount) public {
        require(_amount > 0, "Invalid amount");
        require(_amount < 1000, "Too High amount");
        _mint(msg.sender, _amount);
        emit TokensBought(msg.sender, _amount);
    }

    function stake(uint _amount) public {
        require(_amount > 0, "Invalid amount");
        require(!isStaking[msg.sender], "Already staking");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        
        stakedTokens[msg.sender] += _amount;
        balances[msg.sender] -= _amount;
        isStaking[msg.sender] = true;
        stakingTime[msg.sender] = block.timestamp;

        emit TokensStaked(msg.sender, _amount);
    }

    function checkStake(address _ad) public view returns (uint) {
        if(!isStaking[_ad]) {
            return 0;
        }
        return stakedTokens[_ad];
    }

    function checkStakingTime(address _ad) public view returns (uint) {
        if(!isStaking[_ad]) {
            return 0;
        }
        return stakingTime[_ad];
    }

    function withdrawStake() public {
        require(isStaking[msg.sender], "Not staking");
        
        uint timeStaked = block.timestamp - stakingTime[msg.sender];
        uint reward = stakedTokens[msg.sender] * timeStaked / 100; // Simple reward logic, consider refining
        
        uint totalAmount = stakedTokens[msg.sender] + reward;
        _mint(msg.sender, totalAmount);

        emit StakeWithdrawn(msg.sender, stakedTokens[msg.sender], reward);

        stakedTokens[msg.sender] = 0;
        isStaking[msg.sender] = false;
        stakingTime[msg.sender] = 0;
    }
}
