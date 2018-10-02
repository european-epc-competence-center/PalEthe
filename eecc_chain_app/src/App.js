import React, { Component } from 'react'

import './App.css'


const DEBUGGING_LOG=false;

const ReceiptStates = Object.freeze({
  "open_outbound": "waiting for partner to sign",
  "open_inbound": "partner waiting for my signature",
  "completed": "mutually signed"
});

// ataches event whatch to pal_ethe_instance an returns receipts concerning account
function get_my_receipts(pal_ethe_instance, account)
  {
    if (pal_ethe_instance == null || account == null)
    {
      console.error("get_my_receipts failed. Called to early?", pal_ethe_instance, account);
      return [];
    }

    var my_receipts = [];
    if(DEBUGGING_LOG) console.log("Getting all events from ", pal_ethe_instance);
    pal_ethe_instance.allEvents({fromBlock: 0, toBlock: 'latest'}, (error, result) => {
      if(DEBUGGING_LOG) console.log(result);
      if(error)
      {
        console.error("Error getting event: ", error);
        return;
      }
      if(result.removed)
      {
        console.log("Removed event: ", result);
        return;
      }

      switch(result.event){
        case "NewReceipt":
        if(my_receipts[result.args.id])
        {
          console.error("The same receipt id must not exist twice.", result);
        }
        var new_receipt={
          id: result.args.id.toNumber(),
          partner: result.args.partner,
          balance: result.args.balance.toNumber(),
          button_style: {display:'none'}
        }
        if(result.args.initiator === account)
        {
          my_receipts[result.args.id] = new_receipt;
          my_receipts[result.args.id].state = ReceiptStates.open_outbound;
          if(DEBUGGING_LOG) console.log("outbound receipt: ", new_receipt);
        }
        if (result.args.partner === account)
        {
          my_receipts[result.args.id] = new_receipt;
          my_receipts[result.args.id].partner = result.args.initiator;
          my_receipts[result.args.id].balance = -my_receipts[result.args.id].balance;
          my_receipts[result.args.id].state = ReceiptStates.open_inbound;
          my_receipts[result.args.id].button_style = {display:'inline-block'};
          if(DEBUGGING_LOG) console.log("inbound receipt: ", new_receipt);
        }// else: we are not involved
        break;

        case "ReceiptSigned":
        if(result.args.initiator === account || result.args.partner === account)
        {
          my_receipts[result.args.id].state = ReceiptStates.completed;
          my_receipts[result.args.id].button_style = {display:'none'};
if(DEBUGGING_LOG) console.log("Signed receipt: ", my_receipts[result.args.id]);
        }
        break;

        default:
        console.error("Unknown event: ", result);
      }
    });

    return my_receipts;
  }


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      my_receipts: [],
      total_num_receipts : 0,
      inputBalance: 0,
      inputPartner: "",
      old_account: null,
    }

    this.file_receipt = this.file_receipt.bind(this);
    this.refresh_receipts = this.refresh_receipts.bind(this);
  }

  update(){
    if (this.props.pal_ethe_instance != null)
    {
      if(DEBUGGING_LOG) console.log("get num receipts");
      this.props.pal_ethe_instance.num_receipts().then( num =>
        {
          this.setState({ total_num_receipts: num.toNumber()});
          if(DEBUGGING_LOG)console.log("num receipts = ", num.toNumber());
        });
    }

   }

  componentDidMount() {
    this.timer = setInterval(
      () => this.update(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


  static getDerivedStateFromProps(props, state) {
    if(state.old_account === props.account)
      return {};
    console.log("handling account change: ", props.account);
    return {
      old_account: props.account,
      my_receipts: get_my_receipts(props.pal_ethe_instance, props.account)
    };
  }

  // trigger filter reset at next update
  refresh_receipts()
  {
    this.setState({old_account:null});
  }


  // call contract to issue new receipt
  file_receipt()
  {
    console.log("new receipts", this.props.account, this.state.inputPartner, this.state.inputBalance)
    this.props.pal_ethe_instance.new_receipt(this.state.inputPartner, this.state.inputBalance, {from: this.props.account, gas:220000});
  }


  // call contract to sign receipt
  sign_receipt(id)
  {
    console.log("signing", id);
    this.props.pal_ethe_instance.sign_receipt(id, {from: this.props.account, gas:220000});
  }


  render() {
    return (
      <div className="App">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>PalEthe</h1>
              <p>
              Total number of receipts: {this.state.total_num_receipts}
              </p>

              <h2>New receipt</h2>
              <table>
              <tbody>
              <tr>
              <th>
              My Debt
              </th><th>
              Partner
              </th>
              </tr>
              <tr>
              <td>
              <input value={this.state.inputBalance} type="number" onChange={evt => this.setState({inputBalance: evt.target.value})}/>
              </td>
              <td>
              <select id="title" name="title" value={this.state.inputPartner} onChange={evt => this.setState({inputPartner: evt.target.value})}>
              <option value="" selected>Please choose</option>
              {this.props.partners.map((partner) =>
                <option key={partner.address} value={partner.address}>{partner.name}</option>
              )}
              </select>

              </td>
              </tr>
              </tbody>
              </table>
              <button onClick={this.file_receipt}>File Receipt</button>

              <h2>Your receipts:</h2>
              <table id="receipts_list">
              <tbody>
              <tr>
              <th>ID</th>
              <th>My Debt</th>
              <th>Partner</th><th colSpan="2">Status</th>
              </tr>
              {this.state.my_receipts.map((receipt) =>
                <tr key={receipt.id}>
                <td>
                {receipt.id}
                </td>
                <td>
                {receipt.balance}
                </td>
                <td>
                {this.props.get_name(receipt.partner)}
                </td>
                <td>
                {receipt.state}
                </td>
                <td>
                <button onClick={() => this.sign_receipt(receipt.id)} style={receipt.button_style}>sign</button>
                </td>
                </tr>
              )}
              </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
