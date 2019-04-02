const Web3 = require('web3')
const identity = require('../build/contracts/Identity.json')
const identityABI = identity.abi
const identityBytecode = identity.bytecode

const web3 = new Web3('http://127.0.0.1:8545')

main()

async function main () {
  try {
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    const IdentityContract = new web3.eth.Contract(identityABI)
    const holder = await IdentityContract.deploy({
      data: identityBytecode,
      arguments: [accounts[0]]
    }).send({
      from: accounts[0],
      gas: 480000
    })
    console.log(holder.options.address)
  } catch (e) {
    console.log(e)
  }
}
