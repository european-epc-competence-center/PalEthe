import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results
    var web3 = window.web3
    
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      
      results = {
        web3: web3
      }
      
      console.log('Injected web3 detected.');
      
      resolve(results)
    } else {
        var IP = "127.0.0.1";
      
      var GET = {}
      window.location.search.substr(1).split('&').forEach(function (item) {
        GET[item.split('=')[0]] = item.split('=')[1]
      })

      if (GET.fallback_ip) {
       IP = GET.fallback_ip;
      }
      
      const url="http://"+IP+":8545";
      var provider = new Web3.providers.HttpProvider(url);
      
      web3 = new Web3(provider)
      
      results = {
        web3: web3
      }
      
      console.log('No web3 instance injected, using Local web3 at ' + url);
      
      resolve(results)
    }
  })
})

export default getWeb3
