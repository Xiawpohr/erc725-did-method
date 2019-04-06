/* spec
const ERC725DID = require('erc725-did-mothod')
const did = new ERC725DID('http://127.0.0.1:8545')

const identity = await did.connect(did)
const identity = await did.register(options)
const did = await identity.getDid()
const doc = await identity.resolve()
const event = await identity.addKey(key, type, purpose, options)
const event = await identity.removeKey(key, options)
const event = await identity.revoke(options)

did.setProvider()
*/

const Web3 = require('web3')
const KeyManager = require('../build/contracts/KeyManager.json')
const Identity = require('../build/contracts/Identity.json')
const IdentityABI = Identity.abi
const IdentityBytecode = Identity.bytecode
const KeyManagerABI = KeyManager.abi
const KeyManagerBytecode = KeyManager.bytecode
const web3 = new Web3('http://127.0.0.1:8545')

main()

async function main () {
  try {
    const accounts = await web3.eth.getAccounts()
    const did = await register(accounts[0])
    console.log(did)
    const doc = await resolve(did)
    console.log(doc)
    await revoke(did, { from: accounts[0], gas: 480000 })
    console.log('DID revokes successfully.')
  } catch (e) {
    console.log(e)
  }
}

async function register (account) {
  try {
    const identity = await deployContract({
      abi: IdentityABI,
      bytecode: IdentityBytecode,
      arguments: [account],
      from: account
    })
    const did = `did:erc725:${identity.options.address.slice(2)}`
    return did
  } catch (e) {
    throw new Error(e)
  }
}

async function resolve (did) {
  const parsed = parse(did)
  const address = `0x${parsed.identifier}`
  const identity = await connectContract({ abi: IdentityABI, address })
  const ownerAddress = await identity.methods.owner().call()
  const keyManager = await connectContract({ abi: KeyManagerABI, address: ownerAddress })
  const managementKeyIds = await keyManager.methods.getKeysByPurpose(1).call()
  const unformatedPublicKey = await Promise.all(
    managementKeyIds.map(async (keyId) => {
      return await keyManager.methods.getKey(keyId).call()
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
}

async function revoke (did, { from, gas }) {
  try {
    const parsed = parse(did)
    const address = `0x${parsed.identifier}`
    const identity = await connectContract({ abi: IdentityABI, address })
    await identity.methods.kill().send({ from, gas })
  } catch (e) {
    throw new Error(`revoke failed.-- ${e}`)
  }
}


async function deployContract ({ abi, bytecode, arguments = [], from, gas = 3000000 }) {
  if (
    abi === null ||
    bytecode === null ||
    from === null
  ) {
    throw new Error('abi, bytecode or from should not be null.')
  }

  const contract = new web3.eth.Contract(abi)
  const instance = await contract.deploy({
    data: bytecode,
    arguments
  }).send({
    from,
    gas
  }).catch(console.log)
  return instance
}

async function connectContract ({ abi, address }) {
  if (abi === null || address === null) {
    throw new Error('abi, bytecode or from should not be null.')
  }
  return new web3.eth.Contract(abi, address)
}

function parse (did) {
  if (did === '') throw new Error('Missing DID.')
  const sections = did.match(/^did:([a-zA-Z0-9_]+):([[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/)
  if (sections) {
    const parts = { did: sections[0], method: sections[1], identifier: sections[2] }
    if (sections[3]) parts.path = sections[3]
    if (sections[4]) parts.fragment = sections[4]
    return parts
  }
  throw new Error(`Invalid DID: ${did}`)
}

function getTypeByCode (code) {
  if (code === 1) {
    return 'EcdsaVerificationKey2019'
  } else if (code === 2) {
    return 'RsaVerificationKey2019'
  }
}
