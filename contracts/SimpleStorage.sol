pragma solidity ^0.4.18;

// todo: owned, etc.
contract pallets {

  event NewReceipt(uint id, address initiator, address partner);
  event ReceiptSigned(uint id, address initiator, address partner);

  struct PalletReceipt{
    address initiator;
    address partner;
    int balance;
    bool signed;
  }

  unit max_id;
  mapping ( unit => PalletReceipt ) public pallet_receipt;
  mapping ( address => int ) public total_balance;

  function new_receipt(address partner, int balance)
  {
  // todo: validation

    pallet_receipt[max_id].initiator = msg.sender;
    pallet_receipt[max_id].partner = partner;
    pallet_receipt[max_id].balance = balance;

    emit NewReceipt(max_id, msg.sender, partner);

    max_id++;
  }

  function sign_receipt(uint id)
  {
    if (msg.sender != pallet_receipt[id].partner) return;

    if (pallet_receipt[id].signed) return;
    // todo: validation

    pallet_receipt[id].signed = true;
    emit ReceiptSigned(id, pallet_receipt[id].initiator, pallet_receipt[id].partner);

  }

  function get_receipt() public view returns (uint id) {
    return pallet_receipt[id];
  }
}
