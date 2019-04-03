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
  const accounts = await web3.eth.getAccounts()
  const did = await register(accounts[0])
  console.log(did)
}

async function register (account) {
  try {
    const keyManager = await deployContract({
      abi: KeyManagerABI,
      bytecode: KeyManagerBytecode,
      arguments: [account],
      from: account
    })
    const identityAddress = await keyManager.methods.identity().call({ from: account })
    const did = `did:erc725:${identityAddress.slice(2)}`
    return did
  } catch (e) {
    console.error(e)
  }
}

// async function resolve (did) {

// }

// async function revoke (did) {

// }

async function deployContract ({ abi, bytecode, arguments = [], from, gas = 3000000 }) {
  if (
    abi === null ||
    bytecode === null ||
    from === null
  ) {
    console.error('abi, bytecode or from should not be null.')
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
