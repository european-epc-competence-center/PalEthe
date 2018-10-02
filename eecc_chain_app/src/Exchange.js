import React, { Component } from 'react'

const DEBUGGING_LOG=false;


function hex_to_ascii(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

class Exchange extends Component {

  constructor(props) {
    super(props)

    this.state = {
      local_needs: [],
      where: "",
      need:0,
    }

    this.new_announcement = this.new_announcement.bind(this);
  }

  async update(){
    if (this.props.announce_instance)
    {
      this.props.announce_instance.past_num_places().then( async past_num_places =>
        {
          var local_needs=[];
          for(var i=1; i<past_num_places;i++)
          {
            var announcement = await this.props.announce_instance.announcement_at_place(i);
            if(DEBUGGING_LOG) console.log(announcement);
            local_needs.push(
              {
              who: this.props.get_name(announcement[0]),
              where: hex_to_ascii(announcement[1].toString().substr(2)),
              need:announcement[2].toNumber(),
              });

          }
          this.setState({local_needs:local_needs});
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

  async new_announcement(evt, where, need)
  {
    if(!where) where = this.state.where;
    if(!need) need = this.state.need;

    console.log("announcing", where, need);
    await this.props.announce_instance.new_announcement(where, need, {from: this.props.account, gas:220000});

  }

  render() {
    return (
      <div className="Balance">

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
            <h1>New Announcement</h1>
            <table>
            <tbody>
            <tr>
            <th>
            Where
            </th>
            <td>
            <input value={this.state.where} size="32" maxLength="32" onChange={evt => this.setState({where: evt.target.value})}/>
            </td>
            </tr>
            <tr>
            <th>
            Need
            </th>
            <td>
            <input value={this.state.need} type="number" onChange={evt => this.setState({need: evt.target.value})}/>
            </td>
            </tr>
            </tbody>
            </table>
            <button onClick={this.new_announcement}>Announce</button>

              <h1>Current Announcements</h1>
              <table id="announce_table">
              <tbody>
              <tr>
              <th>Who</th>
              <th>where</th>
              <th>Need</th>
              </tr>
              {this.state.local_needs.map((announcement) =>
                <tr key={announcement.where}>
                <td>{announcement.who}</td>
                <td> {announcement.where}</td>
                <td> {announcement.need}</td>
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

export default Exchange
