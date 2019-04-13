import Identity from './identity.js'

export default class ERC725DID {
  constructor ({ web3 }) {
    if (!web3) throw new Error('There is no web3 provider.')
    this.web3 = web3
  }

  async register ({ from, gas }) {
    const identity = new Identity(this.web3)
    await identity.init({ from, gas })
    return identity
  }

  async connect (did) {
    const identity = new Identity(this.web3, did)
    await identity.init()
    return identity
  }
}
