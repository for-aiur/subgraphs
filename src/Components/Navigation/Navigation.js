import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import './Navigation.css';

class Navigation extends Component {

  render() {
    return (
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Subgraphs<sup>&alpha;</sup></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} onClick={e => this.props.history.push("/editor")}>
              Editor
            </NavItem>
          </Nav>
          <Nav pullRight>
            {
              this.props.user.uid === undefined ? (
                <NavItem eventKey={3} onClick={e => this.props.history.push("/login")}>Login</NavItem>
              ) : (
                <NavDropdown eventKey={3} 
                             title={<span>
                                    <i className='fa fa-user'></i>&nbsp;
                                    {this.props.user.name}
                                    </span>}
                             id='nav-user'>
                  <MenuItem eventKey={3.1} onClick={e => this.props.history.push("/profile")}>Profile</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey={3.2} onClick={e => window.location = "/api/user/logout"}>Logout</MenuItem>
                </NavDropdown>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation = withRouter(Navigation);
