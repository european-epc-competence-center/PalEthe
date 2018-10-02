pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PalEthe.sol";

contract Proxy {
  function proxy_sign(address palethe, uint receipt_id) public{
    PalEthe pal = PalEthe(palethe);
    pal.sign_receipt(receipt_id);

  }
}

contract TestPalEthe {

  uint public initialBalance = 1 ether;

  function test_new_receipt() public {
    PalEthe pal = PalEthe(DeployedAddresses.PalEthe());

    Proxy tester2 = new Proxy();

    uint num_receipts = pal.num_receipts();

    address partner_expected = tester2;
    int balance_expected = 42;
    pal.new_receipt(partner_expected, balance_expected);

    Assert.equal(pal.num_receipts(), num_receipts+1, "Receipt counter should increase on new_receipt.");

    (address initiator, address partner, int balance, bool signed) = pal.pallet_receipt(num_receipts);

    Assert.equal(initiator, this, "Initiator of new contract needs to be this.");
    Assert.equal(partner, partner_expected, "Partner set == get");
    Assert.equal(balance, balance_expected, "Balance set == get.");
    Assert.equal(signed, false, "Receipt is not yet signed by partner.");

    tester2.proxy_sign(pal, num_receipts);
    (initiator, partner, balance, signed) = pal.pallet_receipt(num_receipts);

    Assert.equal(signed, true, "Receipt is signed by partner.");

  }


}
