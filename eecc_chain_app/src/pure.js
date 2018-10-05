const DEBUGGING_LOG = false;

export function decoded_transaction_to_str(web3, caller, decoded_tx)
{
    if(!decoded_tx ||! decoded_tx.name)
        return caller + " called an unknown function";

    var to_str = caller + " called " + decoded_tx.name + "(";
    decoded_tx.params.forEach(param =>{
        to_str += param.name + "[" + param.type + "] = '";
        if(param.type === "bytes32")
        {
            to_str += web3.toAscii(param.value).replace(/[\u0000]/g, "");
        }
        else
        {
            to_str += param.value;
        }
        to_str += "', "
    });
    to_str +=  ");"
    
    return to_str;
}


export async function get_more_blocks(web3, get_name, blocks, max_new) {
    var num = web3.eth.blockNumber;
    if(!max_new) max_new = num;
    if(DEBUGGING_LOG) console.log("number of blocks: ", num);
    const len = blocks.length;
    for (var i = len + 1; i <= Math.min(num, len + max_new); i++) {
        var block = await web3.eth.getBlock(i, true);
        if(DEBUGGING_LOG) console.log(block);
        blocks.unshift(block);
    }
    return blocks;
}

