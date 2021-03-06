pragma solidity >=0.5.0 <0.6.0;

interface ERC734 {

  event KeyAdded(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
  event KeyRemoved(bytes32 indexed key, uint256 indexed purpose, uint256 indexed keyType);
  event ExecutionRequested(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
  event Executed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
  event Approved(uint256 indexed executionId, bool approved);
  event KeysRequiredChanged(uint256 purpose, uint256 number);

  struct Key {
    uint256 purpose; //e.g., MANAGEMENT_KEY = 1, EXECUTION_KEY = 2, etc.
    uint256 keyType; // e.g. 1 = ECDSA, 2 = RSA, etc.
    bytes32 key;
  }

  function keyHasPurpose(bytes32 _key, uint256 _purpose) external view returns (bool exists);
  function getKey(bytes32 _key) external view returns (uint256 purpose, uint256 keyType, bytes32 key);
  function getKeysByPurpose(uint256 _purpose) external view returns (bytes32[] memory keys);
  function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) external returns (bool success);
  function removeKey(bytes32 _key, uint256 _purpose) external returns (bool success);
  // function changeKeysRequired(uint256 purpose, uint256 number) external;
  // function getKeysRequired(uint256 purpose) external view returns(uint256);
  // function execute(address _to, uint256 _value, bytes calldata _data) external returns (uint256 executionId);
  // function approve(uint256 _id, bool _approve) external returns (bool success);
}
