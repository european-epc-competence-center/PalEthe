import React, { Component } from 'react'

const DEBUGGING_LOG=true;


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
            var num = this.props.web3.eth.blockNumber;
            if(DEBUGGING_LOG) console.log("number of blocks: ", num);
            var blocks = this.state.blocks;
            for (var i = blocks.length + 1; i <= num; i++) {
                var block = await this.props.web3.eth.getBlock(i, true);
                if(DEBUGGING_LOG) console.log(block);
                var transactions = [];
                block.transactions.forEach(tx =>{
                    var decoded_tx = this.props.abiDecoder.decodeMethod(tx.input);
                    if(decoded_tx && decoded_tx.name)
                    {
                        var to_str = decoded_tx.name + "(";
                        decoded_tx.params.forEach(param =>{
                            to_str += param.name + "[" + param.type + "] = '";
                            if(param.type === "bytes32")
                            {
                                to_str += this.props.web3.toAscii(param.value);
                            }
                            else
                            {
                                to_str += param.value;
                            }
                            to_str += "', "
                        });
                        to_str +=  ");"
                        transactions.push(to_str);
                    }
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
                                   <td>{block.num}</td>
                                   <td>
                                   <ul>
                                   {
                                       block.transactions.map((tx, index) =>
                                                              <li key={index}>{tx}</li>
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
