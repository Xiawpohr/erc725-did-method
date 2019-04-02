# DID Method Driver Specification
## Overview
Decentralized Idenitfiers (DIDs, see [^1]) are designed to be compatible with any distributed ledger or network. In the Ethereum community, a pattern known as ERC-725, ERC-734 (see [^2] and [^3]) utilizes smart contracts to be a unique identifiable proxy account used by humans, groups, organizations, objects and machine. This Document describes the implementation that allows ERC-725 identities to be treated as valid DIDs.

## CRUD Operation Definition
### Create (Register)
In order to create a erc725 DID, a smart contract compliant with the ERC725 standard must be deployed on Ethereum. The holder of the private key that created the smart contract is the entity identified by the DID. The Ethereum network identifier together with the smart contract address becomes the DID as per the syntax rules above.

```js
const identity = await ERC725.Identity.new()
const did = identity.getDID()
// 'did:erc725:qwertyuiopasdfghjkl
```

### Read (Resolve)
To construct a valid DID document from an erc725 DID, the following steps are performed:
1. Determine the Ethereum network identifier ("mainnet", "ropsten", "rinkeby", or "kovan"). If the DID contains no network identifier, then the default is "mainnet".
2. Invoke the `getKeysByType` function for each of the supported key types, i.e. MANAGEMENT, EXECUTION, CLAIM.
3. For each MANAGEMENT public key:
  - Add a publicKey of type `ERC725ManagementKey` to the DID Document.
4. For each EXECUTION public key:
  - Add a publicKey element of type `ERC725ExecutionKey` to the DID Document.
  - Add an authentication element of type `ERC725ExecutionKey`, referencing the publicKey.
5. For each CLAIM public key:
  - Add a publicKey element of type `ERC725ClaimKey` to the DID Document.

Note: Service endpoints and other elements of a DID Document may be supported in future versions of this specification.

```js
const did = 'did:erc725:qwertyuiopasdfghjkl'
const identity = await ERC725.Identity.resolve(did)
const didDoc = identity.getDoc()
/*
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:example:123456789abcdefghi",
  "publicKey": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "ERC725ManagementKey",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
  }],
  "authentication": [
    {
      "id": "did:example:123456789abcdefghi#execution",
      "type": "ERC725ExecutionKey",
      "controller": "did:example:123456789abcdefghi",
      "publicKeyBase58": "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
    }
  ],
  "service": [{
    "type": "OpenIdConnectVersion1.0Service",
    "serviceEndpoint": "https://openid.example.com/"
  }, {
    "type": "CredentialRepositoryService",
    "serviceEndpoint": "https://repository.example.com/service/8377464"
  }]
}
*/
```

### Update (Key Management)
The DID Document may be updated by invoking the relevant smart contract functions as defined by the ERC725 standard: `addKey` and `removeKey`.
#### Key Creation
```js
const did = 'did:erc725:qwertyuiopasdfghjkl'
const identity = await ERC725.Identity.resolve(did)

const key = '0x202fB73194756C58B7beD0746DcF570FA6e3B040'
const keyType = 3
await identity.addKey(key, keyType)
```

#### Key Revocation
```js
const did = 'did:erc725:qwertyuiopasdfghjkl'
const identity = await ERC725.Identity.resolve(did)
await identity.removeKey(keyId)
```

### Delete (Revoke)
Revoking the DID can be supported by executing a `selfdestruct()` operation that is part of the smart contract. This will remove the smart contract's storage and code from the Ethereum state, effectively marking the DID as revoked.

```js
const did = 'did:erc725:qwertyuiopasdfghjkl'
const identity = await ERC725.Identity.resolve(did)
await identity.revoke()
```

## References
[^1]: https://w3c-ccg.github.io/did-spec/
[^2]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
[^3]: https://github.com/ethereum/EIPs/issues/734
