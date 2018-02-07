import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { subscribe } from './api';
import RoomSelector from './RoomSelector';
import NameSelector from './NameSelector';


class App extends Component {
  state = {
    msgs: []
  };
  constructor(props) {
    super(props);
    subscribe((err, msg) => {
      let msgs = this.state.msgs;
      msgs.push(msg);
      this.setState({
        msgs
      });
    });
  }
  render() {
    let msgsList = this.state.msgs.map((msg, index) => <li key={index}>{msg}</li>);

    return (
      <div className="App">
        <RoomSelector />
        <NameSelector />
        <ul className="App-intro">
        {msgsList}
        </ul>
      </div>
    );
  }
}

export default App;
