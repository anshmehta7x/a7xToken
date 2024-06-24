// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./ERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
 

contract A7XToken is ERC20 {
    address private owner;
    AggregatorV3Interface internal dataFeed;

    
    struct Stake {
        uint amount;
        uint startTime;
        bool isActive;
    }
    
    mapping(address => Stake) private stakes;

    address[] private stakers;

    event TokensBought(address indexed buyer, uint amount);
    event TokensStaked(address indexed staker, uint amount);
    event StakeWithdrawn(address indexed staker, uint amount, uint reward);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier isStaking(address _staker) {
        require(stakes[_staker].isActive, "Not staking");
        _;
    }

    modifier notStaking(address _staker) {
        require(!stakes[_staker].isActive, "Already staking");
        _;
    }

    modifier hasBalance(address _staker, uint _amount) {
        require(balanceOf(_staker) >= _amount, "Insufficient balance");
        _;
    }

    constructor() ERC20("A7XToken", "A7X", 10, 1000000 * 10 ** 10) {
        owner = msg.sender;
        dataFeed = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
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

    function stake(uint _amount) 
        public 
        notStaking(msg.sender) 
        hasBalance(msg.sender, _amount)
    {
        require(_amount > 0, "Invalid amount");
        
        stakes[msg.sender] = Stake({
            amount: _amount,
            startTime: block.timestamp,
            isActive: true
        });
        balances[msg.sender] -= _amount;
        stakers.push(msg.sender);


        emit TokensStaked(msg.sender, _amount);
    }

    function checkStake(address _staker) public view returns (uint) {
        if (!stakes[_staker].isActive) {
            return 0;
        }
        return stakes[_staker].amount;
    }

    function checkStakingTime(address _staker) public view returns (uint) {
        if (!stakes[_staker].isActive) {
            return 0;
        }
        return stakes[_staker].startTime;
    }

    function withdrawStake() public isStaking(msg.sender) {
        Stake memory userStake = stakes[msg.sender];
        
        uint timeStaked = block.timestamp - userStake.startTime;
        uint reward = userStake.amount * timeStaked / 100; // Simple reward logic, consider refining
        
        uint totalAmount = userStake.amount + reward;
        _mint(msg.sender, totalAmount);
        for (uint i = 0; i < stakers.length; i++) {
            if (stakers[i] == msg.sender) {
                stakers[i] = stakers[stakers.length - 1];
                stakers.pop();
                break;
            }
        }

        emit StakeWithdrawn(msg.sender, userStake.amount, reward);

        delete stakes[msg.sender];
    }

    function totalStakedPool() public view returns (uint){
        uint totalStaked = 0;
        for (uint i = 0; i < stakers.length; i++) {
            totalStaked += stakes[stakers[i]].amount;
        }

        return totalStaked;
    }

    function allStakes() public view returns (Stake[] memory) {
        Stake[] memory allStakers = new Stake[](stakers.length);
        for (uint i = 0; i < stakers.length; i++) {
            allStakers[i] = stakes[stakers[i]];
        }
        
        return allStakers;
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int) {

        (, int answer, , , ) = dataFeed.latestRoundData();
        return answer;
    }
}
