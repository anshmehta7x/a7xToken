// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ERC20 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 internal _totalSupply;

    mapping (address => uint256) internal balances;
    mapping (address => mapping (address => uint256)) private allowed;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function _mint(address _to, uint256 _value) internal {
        require(_to != address(0), "ERC20: mint to the zero address");
        _totalSupply += _value;
        balances[_to] += _value;
        emit Transfer(address(0), _to, _value);
    }

    function name() public view returns(string memory) {
        return _name;
    }

    function symbol() public view returns(string memory) {
        return _symbol;
    }

    function decimals() public view returns(uint8) {
        return _decimals;
    }

    function totalSupply() public view returns(uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns(uint256) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns(bool) {
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(_value <= balances[msg.sender], "ERC20: transfer amount exceeds balance");

        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool) {
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(_value <= balances[_from], "ERC20: transfer amount exceeds balance");
        require(_value <= allowed[_from][msg.sender], "ERC20: transfer amount exceeds allowance");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns(bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns(uint256) {
        return allowed[_owner][_spender];
    }

    constructor(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
        _mint(msg.sender, initialSupply);
    }
}
