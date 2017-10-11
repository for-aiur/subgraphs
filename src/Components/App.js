import React, { Component } from 'react';
import './App.css';
import Menu from './Menu.js'
import Graph from './Graph.js'
import Dialog from './Dialog.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    this.toggleDialog = this.toggleDialog.bind(this);
  }

  toggleDialog() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <h1 className="title">Subgraphs</h1>
        </header>
        <div className="menu">
          <Menu />
        </div>
        <div className="body">

          <Dialog show={this.state.isOpen}
                 onClose={this.toggleDialog}>
            Sample content.
          </Dialog>

          <Graph />
        </div>
      </div>
    );
  }
}

export default App;
