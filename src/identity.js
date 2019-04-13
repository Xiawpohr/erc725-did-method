import { deployContract, connectContract, parse, getTypeByCode } from './utils.js'
import IdentityMeta from '../build/contracts/Identity.json'
import KeyManagerMeta from '../build/contracts/KeyManager.json'
const IdentityABI = IdentityMeta.abi
const IdentityBytecode = IdentityMeta.bytecode
const KeyManagerABI = KeyManagerMeta.abi

class Identity {
  constructor (web3, did = null) {
    this.web3 = web3
    this.did = did
    this.from = null
    this.identity = null
    this.keyManager = null
    this.defaultGas = 480000
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
    this.from = await this.keyManager.methods.manager().call()
  }

  async getDid () {
    return this.did
  }

  async resolve () {
    try {
      const managementKeyIds = await this.keyManager.methods.getKeysByPurpose(1).call()
      const unformatedPublicKey = await Promise.all(
        managementKeyIds.map(async (keyId) => {
          return this.keyManager.methods.getKey(keyId).call()
        })
      )
      const publicKey = unformatedPublicKey.map((key, i) => {
        return {
          id: `${this.did}#owner-${i + 1}`,
          type: getTypeByCode(key[1]),
          controller: this.did,
          publicKeyHex: key[2].slice(2)
        }
      })
      const didDoc = {
        '@context': 'https://w3id.org/did/v1',
        id: this.did,
        publicKey
      }
      return JSON.stringify(didDoc)
    } catch (e) {
      throw new Error(`Resolve failed. Message: ${e}`)
    }
  }

  async addKey (key, purpose, type) {
    try {
      const receipt = await this.keyManager.methods.addKey(key, purpose, type).send({
        from: this.from,
        gas: this.defaultGas
      })
      const event = receipt.events.KeyAdded.returnValues
      return {
        key: event.key,
        purpose: event.purpose,
        keyType: event.keyType
      }
    } catch (e) {
      throw new Error(`AddKey failed, Message: ${e}`)
    }
  }

  async removeKey (key, purpose) {
    try {
      const receipt = await this.keyManager.methods.removeKey(key, purpose).send({
        from: this.from,
        gas: this.defaultGas
      })
      const event = receipt.events.KeyRemoved.returnValues
      return {
        key: event.key,
        purpose: event.purpose,
        keyType: event.keyType
      }
    } catch (e) {
      throw new Error(`RemoveKey failed, Message: ${e}`)
    }
  }

  async revoke () {
    try {
      await this.identity.methods.kill().send({
        from: this.from,
        gas: this.defaultGas
      })
      return true
    } catch (e) {
      throw new Error(`Revoke failed. Message: ${e}`)
    }
  }
}

export default Identity
