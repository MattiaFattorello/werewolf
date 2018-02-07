import React, { Component } from 'react';
import { leaveRoom, joinRoom } from './api';

class RoomSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'my-new-room'
    , oldValue: 'my-new-room'
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    leaveRoom(this.state.oldValue)
    joinRoom(this.state.value);
    this.setState({oldValue: this.state.value});
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Room:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default RoomSelector;
