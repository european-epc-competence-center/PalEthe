import { get_more_blocks, decoded_transaction_to_str } from "../eecc_chain_app/src/pure.js"

// dummy
function get_name(hex)
{
    return hex;
}

console.log("Loading...");


// demonstrates how to call get_more_blocks
async function vanilla_block_chain_explorer(web3, blocks)
{
    if(!blocks) blocks=[];

    
    return blocks;
}


// example for how to call new_announcement
async function vanilla_announce(web3, contract_address, who, where, need)
{
    const response = await fetch('../eecc_chain_app/build/contracts/Announce.json');
    const contract = await response.json();
    const announce = await web3.eth.contract(contract.abi).at(contract_address);

    announce.new_announcement(where, need, {from: who, gas:220000});

}


// run examples
window.addEventListener('load', async function() {

    // this needs to be replaced by 192.168.20.41:8545 to use the demo running on gin
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    var web3 = new Web3(provider);


    console.log("loaded. Getting blocks...");


    // you can put blocks back in as the 4th element to update, use an empty array to start with.
    // you can limit the number of fetched blocks with an optional 5th element for performance.
    var blocks = await get_more_blocks(web3, get_name, []);
    
    
    // nonsense display:
    console.log(blocks);
    var h = document.createElement('h1');
    h.innerHTML="Content for EECC CHain Explorer:";
    document.body.appendChild(h);
    var div = document.createElement('div');
    div.innerHTML = JSON.stringify(blocks);
    document.body.appendChild(div);


    // example for how to decode transactions:
    
    var tx = blocks[0].transactions[0];
    // decoder needed to decode transaction input
    // clumsy plain JS way to read som JSON files
    var response = await fetch('../eecc_chain_app/build/contracts/PalEthe.json');
    var contract = await response.json();
    abiDecoder.addABI(contract.abi);
    
    response = await fetch('../eecc_chain_app/build/contracts/Partners.json');
    contract = await response.json();
    abiDecoder.addABI(contract.abi);
    
    response = await fetch('../eecc_chain_app/build/contracts/Announce.json');
    contract = await response.json();
    abiDecoder.addABI(contract.abi);

    const decoded = abiDecoder.decodeMethod(tx.input);
    
    //console.log("abi:", contract.abi);
    //console.log("transaction input:", tx.input, " decoded:", decoded);

    
    // dummy output
    var h = document.createElement('h1');
    h.innerHTML="Last transaction was:";
    document.body.appendChild(h);
    var div = document.createElement('div');
    // you probably rather want to render the decoded input yourself
    div.innerHTML = decoded_transaction_to_str(web3, tx.from, decoded);
    document.body.appendChild(div);



    // example for new announcement:
    
    console.log("Announcing...")
    web3.eth.getAccounts(async (error, accounts)=>{
        if(error) console.error(error);

        // actual announcement:
        // getting the contract address is quite cheated ;)
        await vanilla_announce(web3, blocks[blocks.length - 6].transactions[0].contractAddress, accounts[0], "Innovation Labs", "101");
        
        blocks = await vanilla_block_chain_explorer(web3, blocks);

        console.log("Contract call send. Refresh page to see new block. ;)");
        
    });


    });
