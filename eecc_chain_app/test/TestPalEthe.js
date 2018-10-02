// import expectThrow from 'zeppelin-solidity/test/helpers/expectThrow'; // does not work...?

const PalEthe = artifacts.require("./PalEthe.sol");


contract('PalEthe', async (accounts) => {

  it("starts with 0 balance", async () => {
    const pal = await PalEthe.deployed();

    assert.equal((await pal.get_balance(accounts[0], accounts[0])).toNumber(), 0, "There can not be reflexive debt.");

    assert.equal((await pal.get_balance(accounts[0], accounts[1])).toNumber(), 0, "start with 0 total balance");
    assert.equal((await pal.get_balance(accounts[1], accounts[0])).toNumber(), 0, "balance is antisymmetric");
  });

  let test_balance = 42;

  it("should create new receipts properly.", async () => {
      const pal = await PalEthe.deployed();
      const num_receipts_before_test = (await pal.num_receipts()).toNumber();

      // test the call
      const receipt_id = (await pal.new_receipt.call(accounts[1], test_balance, {from: accounts[0]})).toNumber();

      assert.equal(receipt_id, num_receipts_before_test, "New receipt id");

      // do the call (ignore returned transaction hash)
      await pal.new_receipt(accounts[1], test_balance, {from: accounts[0]});

      assert.equal((await pal.num_receipts()).toNumber(), num_receipts_before_test + 1, "Counter increased");

      const receipt = await pal.pallet_receipt(receipt_id);
      assert.equal(receipt[0], accounts[0]);
      assert.equal(receipt[1], accounts[1]);
      assert.equal(receipt[2], test_balance);
      assert.equal(receipt[3], false);
    });

    it("should only allow receipt signature by correct partner.", async () => {
      const pal = await PalEthe.deployed();
      const receipt_id = (await pal.num_receipts()).toNumber();
      await pal.new_receipt(accounts[1], test_balance, {from: accounts[0]});

      // ensure that some non-partner address can not sign (in particular the initiator can not sign both ends)
      // simple expectThrow
      let has_thrown = false;
      try
      {
        await pal.sign_receipt(receipt_id, {from: accounts[0]});
      }catch(error)
      {
        assert(
          error.message.search("Only partner is allowed to sign") >= 0 // expected but
          || error.message.search("revert") >= 0, // actually there is a VM Exception...
          "Unexpected Error:" + error ,
        );
        has_thrown = true;
      }
      assert(has_thrown, "Only partner is allowed to sign");

      // ensure that partner may sign
      await pal.sign_receipt(receipt_id, {from: accounts[1]});
      const receipt = await pal.pallet_receipt(receipt_id);
      assert.equal(receipt[0], accounts[0], "Receipt details must not be changed in sign");
      assert.equal(receipt[1], accounts[1], "Receipt details must not be changed in sign");
      assert.equal(receipt[2], test_balance, "Receipt details must not be changed in sign");
      assert.equal(receipt[3], true, "Receipt needs to be signed after valid sign.");

  });


  it("changes balance according to signed receipts", async () => {
    const pal = await PalEthe.deployed();

    const start_balance = (await pal.get_balance(accounts[0], accounts[1])).toNumber();

    const receipt_id = (await pal.num_receipts()).toNumber();
    await pal.new_receipt(accounts[1], test_balance, {from: accounts[0]});

    let expected = start_balance;

    assert.equal((await pal.get_balance(accounts[0], accounts[0])).toNumber(), 0, "There can not be reflexive debt.");
    assert.equal((await pal.get_balance(accounts[0], accounts[1])).toNumber(), expected, "receipt not signed -> no change in balance");
    assert.equal((await pal.get_balance(accounts[1], accounts[0])).toNumber(), -expected, "balance is antisymmetric");

    await pal.sign_receipt(receipt_id, {from: accounts[1]});
    expected += test_balance;

    assert.equal((await pal.get_balance(accounts[0], accounts[0])).toNumber(), 0, "There can not be reflexive debt.");

    assert.equal((await pal.get_balance(accounts[0], accounts[1])).toNumber(), expected, "change total balance according to signed receipts");
    assert.equal((await pal.get_balance(accounts[1], accounts[0])).toNumber(), -expected, "balance is antisymmetric");

    const b2 = -23;
    await pal.new_receipt(accounts[1], b2, {from: accounts[0]});
    await pal.sign_receipt(receipt_id + 1, {from: accounts[1]});
    expected += b2;

    assert.equal((await pal.get_balance(accounts[0], accounts[1])).toNumber(), expected, "balance accumulates");
    assert.equal((await pal.get_balance(accounts[1], accounts[0])).toNumber(), -expected, "balance is antisymmetric");


  });

  it("emits the right event on new_receipt", async () => {
    const pal = await PalEthe.deployed();
    let tx = await pal.new_receipt(accounts[1], test_balance, {from: accounts[0]});
    assert.equal(tx.logs[0].event, "NewReceipt");
    assert.equal(tx.logs[0].args.id, (await pal.num_receipts()).toNumber() - 1);
    assert.equal(tx.logs[0].args.initiator, accounts[0]);
    assert.equal(tx.logs[0].args.partner, accounts[1]);
  });

  it("emits the right event on sign_receipt", async () => {
    const pal = await PalEthe.deployed();
    const receipt_id = (await pal.new_receipt.call(accounts[1], test_balance, {from: accounts[0]})).toNumber();
    await pal.new_receipt(accounts[1], test_balance, {from: accounts[0]});
    let tx = await pal.sign_receipt(receipt_id, {from: accounts[1]});
    assert.equal(tx.logs[0].event, "ReceiptSigned");
    assert.equal(tx.logs[0].args.id, receipt_id);
    assert.equal(tx.logs[0].args.initiator, accounts[0]);
    assert.equal(tx.logs[0].args.partner, accounts[1]);
  });

});
