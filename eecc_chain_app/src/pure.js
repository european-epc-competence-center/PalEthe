const DEBUGGING_LOG = false

export function decoded_transaction_to_str (web3, caller, decoded_tx) {
  if (!decoded_tx || !decoded_tx.name) {
    return caller + ': unknown function'
  }

  var to_str = caller + ': ' + decoded_tx.name + '('
  decoded_tx.params.forEach(param => {
    //to_str += param.name + '[' + param.type + "] = '"
    if (param.type === 'bytes32') {
      to_str += web3.toAscii(param.value).replace(/[\u0000]/g, '')
    } else {
      to_str += param.value
    }
    to_str += "', "
  })
  to_str += ');'

  return to_str
}

export async function get_more_blocks (
  web3,
  get_name,
  blocks,
  max_new,
  start_at
) {
  var num = web3.eth.blockNumber
  if (!get_name) get_name = x => x
  if (!blocks) blocks = []
  if (!max_new) max_new = num
  // by default only load the 50 blocks tail, then keep loading new blocks
  if (!start_at && blocks.length === 0 && num > 50) {
    start_at = num - 50
  } else if (blocks.length > 0) {
    start_at = blocks[0].number + 1
  } else {
    start_at = 1
  }
  if (DEBUGGING_LOG) {
    console.log('number of blocks: ', num)
    console.log('start at: ', start_at)
  }
  for (var i = start_at; i <= Math.min(num, start_at + max_new); i++) {
    var block = await web3.eth.getBlock(i, true)
    if (DEBUGGING_LOG) console.log(block)
    blocks.unshift(block)
  }
  return blocks
}
