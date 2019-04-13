export const deployContract = async function ({ web3, abi, bytecode, args = [], from, gas = 3000000 }) {
  if (!web3) throw new Error('There is no web3 provider.')
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
    arguments: args
  }).send({
    from,
    gas
  }).catch(console.log)
  return instance
}

export const connectContract = async function ({ web3, abi, address }) {
  if (!web3) throw new Error('There is no web3 provider.')
  if (abi === null || address === null) {
    throw new Error('abi, bytecode or from should not be null.')
  }
  return new web3.eth.Contract(abi, address)
}

export const parse = function (did) {
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

export const getTypeByCode = function (code) {
  if (code === 1) {
    return 'EcdsaVerificationKey2019'
  } else if (code === 2) {
    return 'RsaVerificationKey2019'
  }
}
