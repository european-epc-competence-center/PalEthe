import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DEBUGGING_LOG = false

function hex_to_ascii (hex) {
  var str = ''
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

class Exchange extends Component {
  constructor (props) {
    super(props)

    this.state = {
      local_needs: [],
      where: '',
      need: 0,
      should_announce: 0,
      announce_msg: '',
      status: ''
    }

    this.new_announcement = this.new_announcement.bind(this)
  }

  componentWillMount () {
    if (this.props.announce && this.props.announce !== 0) {
      this.setState({
        should_announce: this.props.announce,
        announce_msg: ' writing to EECC Block Chain',
        status: 'writing'
      })
    }
  }

  async update () {
    if (DEBUGGING_LOG) console.log('state: ', this.state)

    if (!this.props.announce_instance) {
      return
    }
    const where = 'Innovation Labs'
    if (this.state.should_announce !== 0) {
      if (DEBUGGING_LOG) {
        console.log('announce triggered by should_announce state')
      }
      this.new_announcement({}, where, this.state.should_announce)
      this.setState({
        where: where,
        need: this.state.should_announce,
        should_announce: 0,
        announce_msg: ' published on EECC Block Chain',
        status: 'published'
      })
    } else {
      this.props.announce_instance
        .past_num_places()
        .then(async past_num_places => {
          var local_needs = []
          for (var i = 1; i < past_num_places; i++) {
            var announcement = await this.props.announce_instance.announcement_at_place(
              i
            )
            if (DEBUGGING_LOG) console.log(announcement)
            local_needs.push({
              who: this.props.get_name(announcement[0]),
              where: hex_to_ascii(announcement[1].toString().substr(2)),
              need: announcement[2].toNumber()
            })
          }
          this.setState({ local_needs: local_needs })
        })
    }
  }

  componentDidMount () {
    this.timer = setInterval(() => this.update(), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  async new_announcement (evt, where, need) {
    if (!where) where = this.state.where
    if (!need) need = this.state.need

    console.log('announcing', where, need)
    await this.props.announce_instance.new_announcement(where, need, {
      from: this.props.account,
      gas: 220000
    })
  }

  render () {
    let tbody

    let icon
    if (this.state.status === 'writing') {
      icon = <FontAwesomeIcon icon='spinner' spin />
    }
    if (this.state.status === 'published') {
      icon = <FontAwesomeIcon icon='check' />
    }
    // announce only mode
    if (this.props.announce && this.props.announce !== 0) {
      var verb = 'braucht'
      var need = Math.abs(this.state.need)
      if (this.state.need < 0) {
        verb = 'bietet'
      }
      return (
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <img
                id='logo'
                src={require(`./blockchain_eecc_logo_md.jpg`)}
                className='img-responsive logo display-block'
                alt='EECC Blockchain'
              />
            </div>
          </div>
          <div className='alert alert-info' role='alert'>
            <h4 className='alert-heading'>Veröffentlichung</h4>
            <p>
              {' '}
              {this.props.get_name(this.props.account)}
              {' '}
              {verb}
              {' '}
              {need}
              {' '}
              Paletten in
              {' '}
              {this.state.where}
              !
            </p>
            <hr />
            <p className='mb-0'>{icon}{this.state.announce_msg}</p>
          </div>
        </div>
      )
    }

    // regular mode

    if (this.state.local_needs != null && this.state.local_needs.length !== 0) {
      tbody = (
        <tbody>
          {this.state.local_needs.map(announcement => (
            <tr key={announcement.where}>
              <td> {announcement.who}</td>
              <td> {announcement.where}</td>
              <td> {announcement.need}</td>
            </tr>
          ))};
        </tbody>
      )
    } else {
      tbody = (
        <tbody>
          <tr>
            <td className='text-center' colspan='3'>
              No announcement available
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <div className='Exchange'>

        <main className='container mt-3'>
          <div className='jumbotron py-4'>
            <div className='row'>
              <div className='col'>
                <h1>Create a New Announcement</h1>
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-form-label col-2'>Where</label>
              <div className='col-5'>
                <input
                  className='form-control'
                  value={this.state.where}
                  size='32'
                  maxLength='32'
                  onChange={evt => this.setState({ where: evt.target.value })}
                />
              </div>
            </div>
            <div className='form-group row'>
              <label className='col-form-label col-2'>Need</label>
              <div className='col-5'>
                <input
                  className='form-control'
                  value={this.state.need}
                  type='number'
                  onChange={evt => this.setState({ need: evt.target.value })}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <button
                  className='btn btn-primary'
                  onClick={this.new_announcement}
                >
                  Announce
                </button>
              </div>
            </div>
          </div>
          <div className='row mt-3'>
            <div className='col'>
              <h1>Current Announcements</h1>
            </div>
          </div>
          <div className='row mt-4'>
            <div className='col'>
              <table id='announce_table' className='table'>
                <thead>
                  <tr>
                    <th>Who</th>
                    <th>Where</th>
                    <th>Need</th>
                  </tr>
                </thead>
                {tbody}
              </table>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default Exchange
