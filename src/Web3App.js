import React, { Component } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import PalEthe from '../build/contracts/PalEthe.json'
import Partners from '../build/contracts/Partners.json'
import Announce from '../build/contracts/Announce.json'


import Register from './Register'
import App from './App'
import Balance from './Balance'
import Exchange from './Exchange'

import getWeb3 from './utils/getWeb3'

const DEBUGGING_LOG=false;


class Web3App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      account: null,
      accounts_list: [],
      pal_ethe_instance : null,
      partners_instance : null,
      announce_instance: null,
      partners:[],
      address_to_name: {},
    }

    this.get_name = this.get_name.bind(this);
  }

  // map address to name, if known, otherwise return address
  get_name(address)
  {
    if(address && this.state.address_to_name[address])
    {
      return this.state.address_to_name[address];
    }
    return address;
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
      PalEtheContract.setProvider(this.state.web3.currentProvider);
      PalEtheContract.deployed().then(async instance =>{
        this.setState({
          pal_ethe_instance : instance
        });
      });
    }
    if (this.state.announce_instance == null)
    {
      const AnnounceContract = contract(Announce);
      AnnounceContract.setProvider(this.state.web3.currentProvider);
      AnnounceContract.deployed().then(async instance =>{
        this.setState({announce_instance:instance});
      });
    }

    this.state.web3.eth.getAccounts(async (error, accounts) => {
      if (accounts && accounts.length > 0)
      {
        this.setState({accounts_list: accounts});
        if(!this.state.account || this.state.account === 0){
          this.setState({account: accounts[0]});
        }
      }
    });

    if (this.state.partners_instance != null)
    {
      if(DEBUGGING_LOG)console.log("get registered");
      this.state.partners_instance.num_registered().then(async num =>{
        var partners = this.state.partners;
        var address_to_name = this.state.address_to_name;
        if(DEBUGGING_LOG)console.log("foud ", num.toNumber(), " registered partners");
        // only append new partners:
        for(var i = this.state.partners.length; i < num.toNumber(); i++)
        {
          const adr = await this.state.partners_instance.registered(i);
          const name = await this.state.partners_instance.names(adr);
          partners[i]=
          {
            name: name,
            address: adr
          };
          address_to_name[adr] = name;
        }
        this.setState({
          partners: partners,
          address_to_name: address_to_name,
        });
        if(DEBUGGING_LOG)console.log("partners: ", partners);
      });
    }

  }

  componentDidMount() {
    this.timer = setInterval(() => this.update(),1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


  render() {
    return (
      <div>
      <p>Avtive Account:
      <select value={this.state.account} onChange={evt => this.setState({account: evt.target.value})}>
      {this.state.accounts_list.map((account) =>
        <option key={account} value={account}>{this.get_name(account)} ( {account} )</option>
      )}
      </select>
      </p>
      <Tabs>
      <TabList>
      <Tab>Partners</Tab>
      <Tab>Receipts</Tab>
      <Tab>Total Balance</Tab>
      <Tab>Local Exchange</Tab>
      </TabList>
      <TabPanel>
      <Register
        account={this.state.account}
        accounts_list={this.state.accounts_list}
        partners={this.state.partners}
        partners_instance={this.state.partners_instance}
      />
      </TabPanel>
      <TabPanel>
      <App
        account={this.state.account}
        pal_ethe_instance={this.state.pal_ethe_instance}
        partners={this.state.partners}
        get_name={this.get_name}
      />
      </TabPanel>
      <TabPanel>
      <Balance
        account={this.state.account}
        pal_ethe_instance={this.state.pal_ethe_instance}
        partners={this.state.partners}
        get_name={this.get_name}
      />
      </TabPanel>
      <TabPanel>
      <Exchange
        account={this.state.account}
        announce_instance={this.state.announce_instance}
        get_name={this.get_name}
      />
      </TabPanel>
      </Tabs>
      </div>
    );
  }
}

export default Web3App
