import React, { Component } from 'react';
import './Editor.css';
import Canvas from './Canvas.js'
import Menu from './Menu.js'

class Editor extends Component {
  onNew() {
    this.canvas.newSubgraph();
  }

  onOpen() {
    this.canvas.openSubgraphDialog();
  }

  onSave() {
    this.canvas.saveSubgraph();
  }
  
  onDelete() {
    this.canvas.deleteSubgraph();
  }

  render() {
    let callbacks = {
      new: this.onNew.bind(this),
      open: this.onOpen.bind(this),
      save: this.onSave.bind(this),
      delete: this.onDelete.bind(this)
    };

    return (
      <div className="app">
        <div className="menu">
          <Menu ref={p => this.menu = p} callbacks={callbacks} />
        </div>
        <div className="canvas">
          <Canvas ref={p => this.canvas = p} />
        </div>
      </div>
    );
  }
}

export default Editor;
