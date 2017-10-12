import React, { Component } from 'react';
import './Editor.css';
import Canvas from './Canvas.js'
import Menu from './Menu.js'

class Editor extends Component {
  render() {
    return (
      <div className="app">
        <div className="menu">
          <Menu />
        </div>
        <div className="body">
          <Canvas />
        </div>
      </div>
    );
  }
}

export default Editor;
