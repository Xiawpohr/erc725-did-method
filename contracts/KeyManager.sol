pragma solidity >=0.5.0 <0.6.0;

import "./ERC725.sol";
import "./ERC734.sol";

contract KeyManager is ERC734 {

  uint256 constant MANAGEMENT_KEY = 1;
  uint256 constant EXECUTION_KEY = 2;
  uint256 constant CLAIM_SIGNER_KEY = 3;

  uint256 constant ECDSA_TYPE = 1;
  uint256 constant RSA_TYPE = 2;

  address public manager;
  ERC725 private identity;
  mapping (bytes32 => Key) keys;
  mapping (uint256 => bytes32[]) keysByPurpose;

  constructor(address _identity, address _manager) public {
    manager = _manager;
    identity = ERC725(_identity);
    bytes32 _key = keccak256(abi.encodePacked(_manager));
    keys[_key] = Key({
      purpose: MANAGEMENT_KEY,
      keyType: ECDSA_TYPE,
      key: _key
    });
    keysByPurpose[MANAGEMENT_KEY].push(_key);
    emit KeyAdded(_key, MANAGEMENT_KEY, ECDSA_TYPE);
  }

  function keyHasPurpose(bytes32 _key, uint256 _purpose) external view returns (bool isExistent) {
    if (keys[_key].key == 0) return false;
    if (keys[_key].purpose == _purpose) {
      return true;
    } else {
      return false;
    }
  }


  function getKey(bytes32 _key) external view returns (uint256 purpose, uint256 keyType, bytes32 key) {
    return (keys[_key].purpose, keys[_key].keyType, keys[_key].key);
  }


  function getKeysByPurpose(uint256 _purpose) external view returns (bytes32[] memory _keys) {
    return keysByPurpose[_purpose];
  }

  function addKey(bytes32 _key, uint256 _purpose, uint256 _keyType) external returns (bool success) {
    require(keys[_key].key != _key, "Key already exists.");
    if (msg.sender != address(this)) {
      require(this.keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1), "Sender dose not have a manager key.");
    }

    keys[_key] = Key({
      key: _key,
      purpose: _purpose,
      keyType: _keyType
    });

    emit KeyAdded(_key, _purpose, _keyType);

    return true;
  }


  function removeKey(bytes32 _key, uint256 _purpose) external returns (bool success) {
    require(keys[_key].key == _key, "No such key.");
    if (msg.sender != address(this)) {
      require(this.keyHasPurpose(keccak256(abi.encodePacked(msg.sender)), 1), "Sender does not have a manager key.");
    }
    
    emit KeyRemoved(_key, _purpose, keys[_key].keyType);

    delete keys[_key];

    bytes32[] storage keysCache = keysByPurpose[_purpose];
    for (uint i = 0; i < keysCache.length; i++) {
      if (keysCache[i] == _key) {
        keysCache[i] = keysCache[keysCache.length - 1];
        delete keysCache[keysCache.length - 1];
        keysCache.length --;
        break;
      }
    }
    keysByPurpose[_purpose] = keysCache;


    return true;
  }

}
