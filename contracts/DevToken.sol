// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @notice DevToken is a development token that we use to learn how to code solidity
 * and what BEP-20 interface requires
 */
contract DevToken {

  /**
   * @notice Our Tokens required variables that are needed to operate everything
   */
  uint private _totalSupply;
  uint8 private _decimals;
  string private _symbol;
  string private _name;

  /**
   * @notice _balances is a mapping that contains a addres as KEY
   * and the balance of the address as the valeu
  */
  mapping (address => uint256) private _balances;

  /**
   * @notice Events are created below
   * Transfer event is a event that
  */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @notice constructor will be triggered when we creae Smart contract
   * _name = name of the token
   * _short_symbol = Short Symbol name for the token
   * token_decimals = The decimal precision of the Token, defaults 18
   * _ totalSupply is how much Tokens there are totally
   */
  constructor(string memory token_name, string memory short_symbol, uint8 token_decimals, uint256 token_totalSupply) {
    _name = token_name;
    _symbol = short_symbol;
    _decimals = token_decimals;
    _totalSupply = token_totalSupply;

    // Add all the tokens created to the creator of the token
    _balances[msg.sender] = _totalSupply;

    // Emit an Transfer event to notify the blockchain that an Transfer has occured
    emit Transfer(address(0), msg.sender, _totalSupply);
  }

  /**
   * @notice decimals will return the number of decimal precision the Token is deployed with
   */
   function decimals() external view returns (uint8) {
     return _decimals;
   }

  /**
   * @notice symbol will return the Token's symbol
   */
  function symbol() external view returns (string memory) {
    return _symbol;
  }

  /**
   * @notice name will return the Token's name
   */
  function name() external view returns (string memory) {
    return _name;
  }

  /**
   * @notice totalSupply will return the tokens total supply of tokens
   */
  function totalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  /**
   * @notice balanceOf will return the acount balance for the given account
   */
  function balanceOf(address account) external view returns (uint256) {
    return _balances[account];
  }

  /**
   * @notice mint will create tokens on the address inputted and then increase the total supply
   *
   * It will also emit an Transfer event, with sender set to zero address (address(0))
   * 
   * Requires that the address that is receiving the tokens is not zero address
   */
  function mint(address account, uint256 amount) public {
    require(account != address(0), "DevToken: cannot mint to zero address" );

    // Increase total supply
    _totalSupply = _totalSupply + (amount);
    // Add amount to the ccount balance using the balance mapping
    _balances[account] = _balances[account] + amount;
    // Emit our event to log the action
    emit Transfer(address(0),account, amount);
  }

  /**
   * @notice burn will destroy tokens from an address inputted and then decrease total supply
   * An Transfer event will emit with receiver set to zero address
   *
   * Requires
   * - Account cannot be zero
   * - Account balance has to be bigger or equal to amount
   */
  function burn(address account, uint256 amount) public {
    require(account != address(0), "DevToken: cannot burn from zero address");
    require(_balances[account] >= amount, "DevToken: cannot burn more than the account owns");

    // Remove the amount from the account balance
    _balances[account] = _balances[account] - amount;
    // Decrease totalSupply
    _totalSupply = _totalSupply - amount;
    // emit event, use zero address as receiver
    emit Transfer(account, address(0), amount);

  }

   /**
    * @notice transfer is used to transfer funds from the sender to the recipient.
    * This function is only callable from outside the contract. For internal use see
    * _transfer
    *
    * Requires
    * - Caller cannot be zero
    * - Caller must have a balance = or bigger than amount
    * 
    */
  function transfer(address recipient, uint256 amount) external returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
  }

  /**
   * @notice transfer is used for internal transfers
   *
   * Events
   * - Transfer
   *
   * Requires
   * - Sender cannot be zero
   * - recipient cannot be zero
   * - sender balance must be = or bigger thant amount
  */
  function _transfer(address sender, address recipient, uint256 amount) internal {
    require(sender != address(0), "DevToken: transfer from zero address");
    require(recipient != address(0), "DevToken: transfer to zero address");
    require(_balances[sender] >= amount, "DevToken: can't transfer more than your account holds");

    _balances[sender] = _balances[sender] - amount;
    _balances[recipient] = _balances[recipient] + amount;

    emit Transfer(sender, recipient, amount);
  }


}
