import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import About from './About/About.js';
import Guide from './About/Guide.js';
import Editor from './Editor/Editor.js';
import Login from './User/Login.js';
import Profile from './User/Profile.js';
import Navigation from './Navigation/Navigation.js';
import theUserService from '../Services/UserService.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, user: {} };

    this.updateUser = this.updateUser.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
  }

  componentDidMount() {
    theUserService.subscribe(this.updateUser);
  }

  componentWillUnmount() {
    theUserService.unsubscribe(this.updateUser)
  }

  updateUser(user) {
    this.setState({
      user: user
    });
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
          <Navigation user={this.state.user} />
          <Route exact path="/" component={About}></Route>
          <Route exact path="/Guide" component={Guide}></Route>
          <Route exact path="/Editor" component={Editor}></Route>
          <Route exact path="/Login" component={Login}></Route>
          <Route exact path="/Profile" render={props => (
            <Profile user={this.state.user}/>
          )}>
          </Route>
        </div>
      </HashRouter>
    );
  }
}

export default App;
