pragma solidity >=0.5.0 <0.6.0;

contract owned {
  constructor() public { owner = msg.sender; }
  address payable owner;
}

contract mortal is owned {
  function kill() public {
    if (msg.sender == owner) selfdestruct(owner);
  }
}
