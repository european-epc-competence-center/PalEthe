import React, { Component } from 'react'

class Register extends Component {

  constructor(props) {
    super(props)

    this.state = {
      inputName: "",
      inputAddress: "",
    }
    this.register_partner = this.register_partner.bind(this);
  }

  register_partner()
  {
    console.log("register: ", this.state.inputAddress, this.state.inputName);
    this.props.partners_instance.register(this.state.inputAddress, this.state.inputName, {from: this.props.account});
  }


  render() {
    return (
      <div className="Regsiter">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Register Partners</h1>
              <table>
              <tbody>
              <tr>
              <td>
              Name
              </td><td>
              <input value={this.state.inputName} onChange={evt => this.setState({inputName: evt.target.value})}/>
              </td></tr><tr><td>
              Address
              </td><td>
              <input value={this.state.inputAddress} onChange={evt => this.setState({inputAddress: evt.target.value})} size="64"/>
              </td></tr>
              </tbody>
              </table>
              <button onClick={this.register_partner}>register</button>
              </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Register
