# DID ERC725 Method
Decentralized Idenitfiers (DIDs[^1]) are designed to be compatible with any distributed ledger or network. In the Ethereum community, a pattern known as ERC-725[^2], ERC-734[^3] utilizes smart contracts to be a unique identifiable proxy account used by humans, groups, organizations, objects and machine.

The method implementation allows ERC-725 identities to be treated as valid DIDs.

## Installation
TODO

## Usage
### Initialization
```js
const ERC725DID = require('erc725-did-mothod')
const did = new ERC725DID('http://127.0.0.1:8545')
```

### Register a DID for the identity
```js
const options = {
  from: '0x202fB73194756C58B7beD0746DcF570FA6e3B040',
  gas: 3000000
}
const identity = await did.register(options)
const id = await identity.getDid()
```

### Resolve DID to DID document
```js
const identity = await did.connect('did:erc725:202fB73194756C58B7beD0746DcF570FA6e3B040')
const doc = await identity.resolve()
```

### Key management inside an identity
```js
const event = await identity.addKey(key, type, purpose, options)
const event = await identity.removeKey(key, options)
```

### Revoke a DID for the identity
```js
const event = await identity.revoke(options)
```

## Specification
To see spec, read [this](./doc/DID_Method_Spec.md).

## References
[^1]: https://w3c-ccg.github.io/did-spec/
[^2]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
[^3]: https://github.com/ethereum/EIPs/issues/734
