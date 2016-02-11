import React, {Component} from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Navbar from './Navbar';
import UserList from './UserList';

var socket = require('socket.io-client')();

class App extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      users: [],
      username: ''
    };

    this.onAddMessage = this.onAddMessage.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
  }

  componentDidMount() {
    socket.on('connect', function(){console.log("YEAH")});
    socket.on('chat message', (message) => {
      this.setState(Object.assign(this.state, {}, {
        messages: this.state.messages.concat([message])
      }));
    });
    socket.on('update users', (users) => {
      this.setState(Object.assign(this.state, {}, {
        users: users
      }));
    });
    socket.on('disconnect', function(){console.log("BOO!")});
  }

  onAddMessage(message, isError) {
    if (isError) {
      this.setState(Object.assign(this.state, {}, {
        messages: this.state.messages.concat([message])
      }));
    } else {
      socket.emit('chat message', message);
    }
  }

  onAddUser(username) {
    this.setState(Object.assign(this.state, {}, {
      username: username
    }));
    socket.emit('add user', username);
  }

  render() {
    return (
      <div>
        <Navbar onAddUser={this.onAddUser}></Navbar>
        <div className="container-fluid">
          <div className="col-md-7"></div>
          <div className="col-md-1">
            <UserList users={this.state.users}></UserList>
          </div>
          <div className="col-md-4">
            <MessageList messages={this.state.messages}></MessageList>
            <MessageInput onAddMessage={this.onAddMessage} username={this.state.username}></MessageInput>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
