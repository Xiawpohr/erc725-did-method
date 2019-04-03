pragma solidity >=0.5.0 <0.6.0;

interface ERC725 {
  event DataChanged(bytes32 indexed key, bytes32 indexed value);
  event OwnerChanged(address indexed ownerAddress);
  event ContractCreated(address indexed contractAddress);

  function changeOwner(address _owner) external;
  function getData(bytes32 _key) external view returns (bytes32 _value);
  function setData(bytes32 _key, bytes32 _value) external;
  function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data) external;
}
