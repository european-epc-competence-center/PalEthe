import React, { Component } from 'react'

class Register extends Component {
  constructor (props) {
    super(props)

    this.state = {
      inputName: '',
      inputAddress: '',
      message: ''
    }
    this.register_partner = this.register_partner.bind(this)
    this.register_all_accounts = this.register_all_accounts.bind(this)
  }

  register_partner (evt, account, name) {
    if (!account) account = this.state.inputAddress
    if (!name) name = this.state.inputName
    console.log('register: ', account, name)
    // todo: error handling (e.g. registering the same adress twice)
    this.props.partners_instance.register(account, name, {
      from: this.props.account
    })
    this.setState({
      inputAddress: '',
      inputName: '',
      message: 'Registering ' + account + ' as ' + name + ' ...'
    })
  }

  // dev helpter
  register_all_accounts () {
    const real_names = ['EECC', 'Garlock', 'Bosch', 'GS1 Germany']
    var i = 0
    this.props.accounts_list.forEach(account => {
      var name = 'Partner ' + i
      if (i < real_names.length) name = real_names[i]

      this.register_partner(null, account, name)
      i++
    })
  }

  render () {
    return (
      <div className='Regsiter'>

        <main className='container'>
          <div className='pure-g'>
            <div className='pure-u-1-1'>

              <h1>Registered Partners</h1>
              <ul>
                {this.props.partners.map(partner => (
                  <li key={partner.address}>
                    {' '}{partner.name} ( {partner.address} )
                  </li>
                ))}
              </ul>

              <h1>Unlocked Accounts</h1>
              <ul>
                {this.props.accounts_list.map(account => (
                  <li key={account}>
                    {account}
                  </li>
                ))}
              </ul>

              <h1>Register New Partner</h1>
              <table>
                <tbody>
                  <tr>
                    <td>
                      Name
                    </td><td>
                      <input
                        value={this.state.inputName}
                        onChange={evt =>
                          this.setState({ inputName: evt.target.value })}
                      />
                    </td>
                  </tr><tr>
                    <td>
                      Address
                    </td><td>
                      <input
                        value={this.state.inputAddress}
                        onChange={evt =>
                          this.setState({ inputAddress: evt.target.value })}
                        size='64'
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>
                <button onClick={this.register_partner}>register</button>
              </p>
              <p>
                {this.state.message}
              </p>
              <h1>Bootstrap</h1>
              <p>
                <button onClick={this.register_all_accounts}>
                  Register all known accounts
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Register
