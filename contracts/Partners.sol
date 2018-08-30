pragma solidity ^0.4.24;

import 'zeppelin-solidity/contracts/lifecycle/Destructible.sol';

contract Partners is Destructible{
  mapping ( address => string ) public names;
  mapping (uint8 => address) public registered;
  uint8 public num_registered;

  event Register(uint8 id, address adr, string name);

  function register(address adr, string name) public
  {
    require(registered[adr]==0, "Adress already registered.");
    
    registered[num_registered] = adr;
    names[adr] = name;
    emit Register(num_registered, adr, name);
    num_registered++;
  }

}
