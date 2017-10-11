import React, { Component } from 'react';
import './Menu.css';

class Menu extends Component {
  render() {
  return (
  <div>
    <a className="btn btn-default" aria-label="New">
      <i className="fa fa-file-o" aria-hidden="true"></i>
    </a>&nbsp;
    <a className="btn btn-default" aria-label="Run">
      <i className="fa fa-folder-open-o" aria-hidden="true"></i>
    </a>&nbsp;
    <a className="btn btn-default" aria-label="Save">
      <i className="fa fa-save" aria-hidden="true"></i>
    </a>&nbsp;
  </div>
  );
  }
}

export default Menu;
