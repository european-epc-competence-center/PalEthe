pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/lifecycle/Destructible.sol";

contract Announce is Destructible{

    struct Announcement{
      address who;
      bytes32 where;
      int need;
    }

  event NewAnnouncement(address who, bytes32 where, uint place_id, int need);

  // num places + 1
  uint public past_num_places;
  // starts at 1 to avoid the null value
  mapping (uint => bytes32) public place_name;
  // backwards mapping
  mapping (bytes32 => uint) public place_id;

  // actual list of place_id -> Announcement
  mapping ( uint => Announcement ) public announcement_at_place;

  function new_announcement(bytes32 where, int need) public
  {
    // set starting value for past_num_places (highly gas innefficient)
    if(past_num_places == 0){
      past_num_places = 1;
    }

    // create new place if not existing
    if (place_id[where] == 0)
    {
      place_id[where] = past_num_places;
      place_name[past_num_places] = where;
      past_num_places++;
      announcement_at_place[place_id[where]].who = msg.sender;
      announcement_at_place[place_id[where]].where = where;
    }

    // simple first come first serve (TOFU) ;)
    require(announcement_at_place[place_id[where]].who == msg.sender, "Only the place owner can announce here");

    announcement_at_place[place_id[where]].need = need;

    emit NewAnnouncement(msg.sender, where, place_id[where], need);

    }

}
