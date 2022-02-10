const { assert } = require("chai");

const DevToken = artifacts.require("DevToken");

// start a test series named DevToken, it will use 10 test accounts
contract("DevToken", async accounts => {
  // each it is a new test, and we name our first test initial supply
  it("initial supply", async () => {
    // wait until devtoken is deployed, store the results inside devToken
    // the result is a client to the Smart contract api
    const devToken = await DevToken.deployed();
    // call our totalSupply function
    let supply = await devToken.totalSupply();
    // Assert that the supply matches what we set in migration
    assert.equal(supply.toNumber(), 5000000, "Initial supply was not the same as in migration")
  })

  it("minting", async () => {
    devToken = await DevToken.deployed();

    // Let's use account 1 since that account should have 0
    let initial_balance = await devToken.balanceOf(accounts[1]);

    // Let's verify the balance
    assert.equal(initial_balance.toNumber(), 0, "initial balance for account 1 should be 0");

    // Let's mint 100 tokens to the user and grab the balance again
    let totalSupply = await devToken.totalSupply();
    await devToken.mint(accounts[1], 100);
    // Grab the balance again to see what it is after calling mint
    let after_balance = await devToken.balanceOf(accounts[1]);
    let after_supply = await devToken.totalSupply();
    // Assert and check that they match
    assert.equal(after_balance.toNumber(), 100, "The balance after minting 100 should be 100");
    assert.equal(after_supply.toNumber(), totalSupply.toNumber()+100, "The totalSupply should be increased");

    try {
      // Mint with address 0
      await devToken.mint('0x0000000000000000000000000000000000000000', 100);
    } catch (error) {
      assert.equal(error.reason, "DevToken: cannot mint to zero address", "Failed to stop minting on zero address");
    }
  })

  it("burning", async () => {
    devToken = await DevToken.deployed();

    // Let's continue on account 1 since that account now has 100 tokens
    let initial_balance = await devToken.balanceOf(accounts[1]);

    // Burn to address 0
    try {
      await devToken.burn('0x0000000000000000000000000000000000000000', 100);
    } catch (error) {
      assert.equal(error.reason, "DevToken: cannot burn from zero address", "Failed to notice burning on 0 address")
    }

    // Burn more than balance
    try {
      await devToken.burn(accounts[1], initial_balance+initial_balance);
    } catch (error) {
      assert.equal(error.reason, "DevToken: cannot burn more than the account owns", "Failed to capture too big burns on an account")
    }

    let totalSupply = await devToken.totalSupply();

    try {
      await devToken.burn(accounts[1], initial_balance - 50);
    } catch (error) {
      assert.fail(error);
    }

    let balance = await devToken.balanceOf(accounts[1]);

    // Make sure balance was reduced and that totalSupply reduced
    assert.equal(balance.toNumber(), initial_balance-50, "Burning 5 should reduce users balance")

    let newSupply = await devToken.totalSupply();

    assert.equal(newSupply.toNumber(), totalSupply.toNumber()-50, "Total supply not properly reduced");
  })

  it('trasfering tokens', async () => {
    devToken = await DevToken.deployed();

    // Grab initial balance
    let initial_balance = await devToken.balanceOf(accounts[1]);

    // transfer tokens from account 0 to 1
    await devToken.transfer(accounts[1], 100);

    let after_balance = await devToken.balanceOf(accounts[1]);

    assert.equal(after_balance.toNumber(), initial_balance.toNumber() + 100, "Balance should have increased on receiver" )

    // We can change the msg.sender using the FROM value in function calls.
    let account2_initial_balance = await devToken.balanceOf(accounts[2]);

    await devToken.transfer(accounts[2], 20, { from: accounts[1]});
    // Make sure balances are switched on both accounts
    let account2_after_balance = await devToken.balanceOf(accounts[2]);
    let account1_after_balance = await devToken.balanceOf(accounts[1]);

    assert.equal(account1_after_balance.toNumber(), after_balance.toNumber()-20, "Should have reduced account 1 balance by 20");
    assert.equal(account2_after_balance.toNumber(), account2_initial_balance.toNumber()+20, "Should have given accounts 2 20 tokens");

    // Try transfering too much
    try {
      await devToken.transfer(accounts[2], 2000000000000, { from: accounts[1]});      
    } catch (error) {
      assert.equal(error.reason, "DevToken: can't transfer more than your account holds");
    }
  })

})