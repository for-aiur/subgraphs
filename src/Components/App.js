import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import About from './About/About.js'
import Editor from './Editor/Editor.js'
import Navigation from './Navigation/Navigation.js'

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
      <HashRouter>
        <div>
          <Navigation />
          <Route exact path="/" component={Editor}></Route>
          <Route path="/About" component={About}></Route>
        </div>
      </HashRouter>
    );
  }
}

export default App;
