import React, { Component } from 'react';
import './Menu.css';

class Menu extends Component {
  render() {
    return (
      <div className="btn-toolbar">
        <div className="btn-group">
          <a className="btn btn-primary" onClick={e => this.props.callbacks.new()}>
            <i className="fa fa-file-o"></i>
          </a>
        </div>
        <div className="btn-group">
          <a className="btn btn-primary" onClick={e => this.props.callbacks.open()}>
            <i className="fa fa-folder-open-o"></i>
          </a>
        </div>
        <div className="btn-group">
          <a className="btn btn-primary" onClick={e => this.props.callbacks.save()}>
            <i className="fa fa-save"></i>
          </a>
        </div>
      </div>
    );
  }
}

export default Menu;
