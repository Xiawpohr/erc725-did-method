import { deployContract, connectContract, parse, getTypeByCode } from './utils.js'
import IdentityMeta from '../build/contracts/Identity.json'
import KeyManagerMeta from '../build/contracts/KeyManager.json'
const IdentityABI = IdentityMeta.abi
const IdentityBytecode = IdentityMeta.bytecode
const KeyManagerABI = KeyManagerMeta.abi
const KeyManagerBytecode = KeyManagerMeta.bytecode

class Identity {
  constructor (web3, did = null, { from, gas } = {}) {
    this.web3 = web3
    this.did = did
  }
  
  async init ({ from, gas } = {}) {
    if (this.did) {
      const { identifier } = parse(this.did)
      this.identity = await connectContract({
        web3: this.web3,
        abi: IdentityABI,
        address: identifier
      })
    } else {
      this.identity = await deployContract({
        web3: this.web3,
        abi: IdentityABI,
        bytecode: IdentityBytecode,
        args: [from],
        from,
        gas
      })
      this.did = `did:erc725:${this.identity.options.address.slice(2)}`
    }

    const ownerAddress = await this.identity.methods.owner().call()
    this.keyManager = await connectContract({
      web3: this.web3,
      abi: KeyManagerABI,
      address: ownerAddress
    })
  }

  async getDid () {
    return this.did
  }

  async resolve () {
    try {
      const managementKeyIds = await this.keyManager.methods.getKeysByPurpose(1).call()
      const unformatedPublicKey = await Promise.all(
        managementKeyIds.map(async (keyId) => {
          return await this.keyManager.methods.getKey(keyId).call()
        })
      )
      const publicKey = unformatedPublicKey.map((key, i) => {
        return {
          id: `${did}#owner-${i}`,
          type: getTypeByCode(key[1]),
          controller: did,
          publicKeyHex: key[2].slice(2)
        }
      })
      const didDoc = {
        '@context': 'https://w3id.org/did/v1',
        id: did,
        publicKey
      }
      return JSON.stringify(didDoc)
    } catch (e) {
      throw new Error(`Resolve failed. Message: ${e}`)
    }
  }

  addKey () {}
  removeKey () {}

  async revoke ({ from, gas }) {
    try {
      await this.identity.methods.kill().send({ from, gas })
    } catch (e) {
      throw new Error(`Revoke failed. Message: ${e}`)
    }
  }
}

export default Identity
