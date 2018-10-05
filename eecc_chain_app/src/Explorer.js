import React, { Component } from 'react'

import { get_more_blocks, decoded_transaction_to_str } from './pure'    


class Explorer extends Component {
    
    constructor(props) {
        super(props)
        
        this.state = {
            blocks:[],
        }
        
    }

    async update(){
        if (this.props.web3)
        {
            var web3 = this.props.web3;
            var get_name = this.props.get_name;
            var blocks = this.state.blocks;
            
            blocks = await get_more_blocks(web3, get_name, blocks, 10);
            
            this.setState({blocks:blocks});
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


  render() {
    return (
      <div className="Balance">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
            <h1>EECC Chain Explorer</h1>
            <table>
            <tbody>
            <tr>
            <th>
            Block Number
            </th>
            <th>
            Transactions
            </th>
            </tr>
            {this.state.blocks.map((block) =>
            <tr key={block.hash}>
                                   <td>{block.number}</td>
                                   <td>
                                   <ul>
                                   {
                                       block.transactions.map((tx, index) =>
                                                              <li key={index}>{decoded_transaction_to_str(this.props.web3, tx.from, this.props.abiDecoder.decodeMethod(tx.input))}</li>
                                                             )}
                                   </ul>
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

export default Explorer
