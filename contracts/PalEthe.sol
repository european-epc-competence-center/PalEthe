pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';

contract PalEthe is Destructible{

    struct PalletReceipt{
      address initiator;
      address partner;
      int balance;
      bool signed;
    }

  event NewReceipt(uint id, address initiator, address partner);
  event ReceiptSigned(uint id, address initiator, address partner);

  uint public num_receipts;

  mapping ( uint => PalletReceipt ) public pallet_receipt;

  // keep track of total mutual debt
  // keys are ordered <
  mapping ( address => mapping ( address => int) ) internal total_balance;

  // return id of generated receipt
  function new_receipt(address partner, int balance) public returns (uint)
  {
  // todo: partner validation

    pallet_receipt[num_receipts].initiator = msg.sender;
    pallet_receipt[num_receipts].partner = partner;
    pallet_receipt[num_receipts].balance = balance;

    emit NewReceipt(num_receipts, msg.sender, partner);

    num_receipts++;

    return num_receipts - 1;
  }


  function sign_receipt(uint id) public
  {
    require(msg.sender == pallet_receipt[id].partner, "Only partner is allowed to sign");
    require(!pallet_receipt[id].signed, "Receipt is already signed.");

    // todo: initiator validation

    pallet_receipt[id].signed = true;
    emit ReceiptSigned(id, pallet_receipt[id].initiator, pallet_receipt[id].partner);

    address a1 = pallet_receipt[id].initiator;
    address a2 = pallet_receipt[id].partner;
    int d = pallet_receipt[id].balance;

    // order addresses
    if(a1 > a2)
    {
      a2 = a1;
      a1 = pallet_receipt[id].partner;
      d = -d;
    }

    total_balance[a1][a2] += d;

  }

  function get_balance(address a1, address a2) public view returns (int) {
    if(a1 > a2)
      return -total_balance[a2][a1];
    return total_balance[a1][a2];
  }
}
