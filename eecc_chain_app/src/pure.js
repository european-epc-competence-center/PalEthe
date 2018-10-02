const DEBUGGING_LOG = false;

export async function get_more_blocks(web3, abiDecoder, get_name, blocks, max_new) {
    var num = web3.eth.blockNumber;
    if(!max_new) max_new = num;
    if(DEBUGGING_LOG) console.log("number of blocks: ", num);
    const len = blocks.length;
    for (var i = len + 1; i <= Math.min(num, len + max_new); i++) {
        var block = await web3.eth.getBlock(i, true);
        if(DEBUGGING_LOG) console.log(block);
        var transactions = [];
        block.transactions.forEach(tx =>{
            var to_str = get_name(tx.from) + " called ";
            var decoded_tx = abiDecoder.decodeMethod(tx.input);
            if(decoded_tx && decoded_tx.name)
            {
                to_str += decoded_tx.name + "(";
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
            }else{
                to_str += "an unknown function"
            }
            
            transactions.push(to_str);
        });
        if(DEBUGGING_LOG) console.log(transactions);

        blocks.unshift(
            {
                num: i,
                hash: block.hash,
                transactions: transactions,
                timestamp: block.timestamp
            }
        );
    }
    return blocks;
}
