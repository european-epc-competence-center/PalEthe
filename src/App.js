import React, { Component } from 'react'
import PalEthe from '../build/contracts/PalEthe.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: '0x',
      num_receipts:0,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract');
    const PalEtheContract = contract(PalEthe);
    PalEtheContract.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      console.log(accounts);
      this.setState({ account: accounts[0]});
      const pal = await PalEtheContract.deployed();
      this.setState({ num_receipts: (await pal.num_receipts()).toNumber()});

    });
  }

  render() {
    return (
      <div className="App">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>PalEthe</h1>
              <p>Avtive Account: {this.state.account}</p>

              <p>
              Total number of receipts: {this.state.num_receipts}
              </p>

            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
