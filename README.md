# DID ERC725 Method
Decentralized Idenitfiers (DIDs[^1]) are designed to be compatible with any distributed ledger or network. In the Ethereum community, a pattern known as ERC-725[^2], ERC-734[^3] utilizes smart contracts to be a unique identifiable proxy account used by humans, groups, organizations, objects and machine.

The method implementation allows ERC-725 identities to be treated as valid DIDs.

## Installation
```
npm install @xiawpohr/erc725-did-method
```

## Usage
### Initialization
```js
const Web3 = require('web3')
const ERC725DID = require('erc725-did-method')
const web3 = new Web3('http://127.0.0.1:8545')
const erc725did = new ERC725DID({ web3 })
```

### Register a DID for the identity
```js
const options = {
  from: '0x202fB73194756C58B7beD0746DcF570FA6e3B040',
  gas: 3000000
}
const identity = await erc725did.register(options)
const did = await identity.getDid()
```

### Resolve DID to DID document
```js
const identity = await erc725did.connect('did:erc725:202fB73194756C58B7beD0746DcF570FA6e3B040')
const doc = await identity.resolve()
```

### Key management inside an identity
```js
const key = web3.utils.keccak256('0x202fB73194756C58B7beD0746DcF570FA6e3B040')
const purpose = 2
const type = 1
const event = await identity.addKey(key, purpose, type)
const event = await identity.removeKey(key, purpose)
```

### Revoke a DID for the identity
```js
await identity.revoke()
```

## Specification
To see spec, read [this](./doc/DID_Method_Spec.md).

## References
[^1]: https://w3c-ccg.github.io/did-spec/
[^2]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
[^3]: https://github.com/ethereum/EIPs/issues/734
