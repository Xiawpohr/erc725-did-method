const Web3 = require('web3')
const ERC725DID = require('../build/lib/erc725did.min.js').default

main() 

async function main () {
  const web3 = new Web3('http://127.0.0.1:8545')
  const did = new ERC725DID({ web3 })

  const accounts = await web3.eth.getAccounts()
  const options = {
    from: accounts[0],
    gas: 3000000
  }
  const identity = await did.register(options)
  const id = await identity.getDid()
  // const identity = await did.connect(did)
  // const doc = await identity.resolve()
  console.log(id)
  // const event = await identity.addKey(key, type, purpose, options)
  // const event = await identity.removeKey(key, options)
  // const event = await identity.revoke(options)
}

// did.setProvider()