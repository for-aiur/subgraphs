import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Navigation.css';

class Navigation extends Component {
  render() {
    return (
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Subgraphs<sup>&alpha;</sup></Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} onClick={e => this.props.history.push("/editor")}>
              Editor
            </NavItem>
            <NavItem eventKey={2} onClick={e => this.props.history.push("/about")}>
              About
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} onClick={e => this.props.history.push("/login")}>
              Login
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation = withRouter(Navigation);
