import { get_more_blocks } from "../eecc_chain_app/src/pure.js"

function get_name(hex)
{
    return hex;
}

console.log("Loading...");

window.addEventListener('load', async function() {

    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    var web3 = new Web3(provider);

    // clumsy plain JS way to read som JSON files
    fetch('../eecc_chain_app/build/contracts/PalEthe.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(contract) {
            abiDecoder.addABI(contract.abi);
        });

    fetch('../eecc_chain_app/build/contracts/Partners.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(contract) {
            abiDecoder.addABI(contract.abi);
        });

    fetch('../eecc_chain_app/build/contracts/Announce.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(contract) {
            abiDecoder.addABI(contract.abi);
        });

    console.log("loaded. Getting blocks...");
    
    var blocks = await get_more_blocks(web3, abiDecoder, get_name, []);
    
    console.log(blocks);

    var h = document.createElement('h1');
    h.innerHTML="Content for EECC CHain Explorer:";
    document.body.appendChild(h);
    var div = document.createElement('div');
    div.innerHTML = JSON.stringify(blocks);
    document.body.appendChild(div);
    
    });
