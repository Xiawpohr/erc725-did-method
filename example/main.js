const Web3 = require('web3')
const ERC725DID = require('../build/lib/erc725did.min.js').default

main()

async function main () {
  const web3 = new Web3('http://127.0.0.1:8545')
  const erc725did = new ERC725DID({ web3 })
  const accounts = await web3.eth.getAccounts()

  const identity = await erc725did.register({
    from: accounts[0],
    gas: 3000000
  })
  const did = await identity.getDid()
  console.log(did)

  const identity2 = await erc725did.connect(did)
  const did2 = await identity2.getDid()
  console.log(did2)

  const doc = await identity.resolve()
  console.log(doc)

  const key = web3.utils.keccak256(accounts[1])
  const addKeyEvent = await identity.addKey(key, 2, 1)
  console.log(addKeyEvent)

  const removeKeyEvent = await identity.removeKey(key, 2)
  console.log(removeKeyEvent)

  await identity.revoke()
}

// did.setProvider()
