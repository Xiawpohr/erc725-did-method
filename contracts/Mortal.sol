pragma solidity >=0.5.0 <0.6.0;

contract Owned {
  constructor() public { owner = msg.sender; }
  address payable owner;
}

contract Mortal is Owned {
  function kill() public {
    if (msg.sender == owner) selfdestruct(owner);
  }
}
