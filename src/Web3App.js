import React, { Component } from 'react'

import PalEthe from '../build/contracts/PalEthe.json'
import Partners from '../build/contracts/Partners.json'

import Register from './Register'
import App from './App'

import getWeb3 from './utils/getWeb3'

class Web3App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      pal_ethe_instance : null,
      partners_instance : null,
    }

    this.child = React.createRef();
  }

  componentWillMount() {
    getWeb3.then(results => {
      this.setState({web3: results.web3});
    });
  }

  update(){
    const contract = require('truffle-contract');

    if (this.state.partners_instance == null)
    {
      const PartnersContract = contract(Partners);
      PartnersContract.setProvider(this.state.web3.currentProvider);
      PartnersContract.deployed().then(async instance =>{
        this.setState({partners_instance:instance});
      });
    }
    if (this.state.pal_ethe_instance == null)
    {
      const PalEtheContract = contract(PalEthe);
      PalEtheContract.setProvider(this.props.web3.currentProvider);
      PalEtheContract.deployed().then(async instance =>{
        this.setState({
          pal_ethe_instance : instance
        });
        if(this.child.handle_account_change){
          this.child.handle_account_change();
        }
      });
    }

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      if (accounts && accounts.length > 0 && this.state.account !== accounts[0])
      {
        this.setState({account: accounts[0]});
        if(this.child.handle_account_change){
          this.child.handle_account_change();
        }
      }
    });

  }

  componentDidMount() {
    this.timer = setInterval(() => this.update(),1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <section>
      <section>
        <App
          account={this.state.account}
          partners_instance={this.state.partners_instance}
          pal_ethe_instance={this.state.pal_ethe_instance}
          ref={this.child}
        />
      </section>
      <section>
        <Register
          account={this.state.account}
          partners_instance={this.state.partners_instance}
        />
      </section>
      </section>
    );
  }
}

export default Web3App
