import React, { Component } from 'react'

class Balance extends Component {

  constructor(props) {
    super(props)

    this.state = {
      total_balance: [],
    }
  }

  async update(){
    if (this.props.pal_ethe_instance && this.props.partners)
    {
      var total_balance=[];
      var partners = this.props.partners;
      for(var i = 0; i < partners.length;i++)
      {
        for(var j = i; j < partners.length;j++)
        {
          var name1 = this.props.get_name(partners[i].address);
          var name2 = this.props.get_name(partners[j].address);
          var balance = await this.props.pal_ethe_instance.get_balance(partners[i].address, partners[j].address);
          var direction = ">";
          if(balance < 0)
          {
            direction = "<";
          }
          total_balance.push(
            {
              from: name1,
              to: name2,
              balance: balance,
              print: name1 + " -" + direction + "- " + Math.abs(balance) + " -" + direction + "- " + name2
            }
          );
        }
      }
      this.setState({total_balance:total_balance});
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

              <h1>Total Balances</h1>
              <ul>
              {this.state.total_balance.map((dept, index) =>
                <li key={index}> {dept.print} </li>
              )}
              </ul>
              </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Balance
