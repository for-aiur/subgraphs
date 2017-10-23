import React, { Component } from 'react';
import './Editor.css';
import Canvas from './Canvas.js'
import Menu from './Menu.js'
import theCatalogService from '../../Services/CatalogService.js'
import theCommandService from '../../Services/CommandService.js'

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

  onRun() {
    let identifier = this.canvas.scope.identifier;
    if (!theCatalogService.getItemByIdentifier('compositions', identifier)) {
      this.canvas.messageDialog.open(
        'Error', 'Current project is not saved.');
      return;
    }
    theCommandService.sendCommand({
      'name': 'run',
      'identifier': `run:${identifier}`,
      'content': {
        'identifier': identifier
      }
    });
  }

  onStop() {
    let identifier = this.canvas.scope.identifier;
    theCommandService.sendCommand({
      'name': 'stop',
      'identifier': `stop:${identifier}`,
      'content': {
        'identifier': identifier
      }
    });
  }

  render() {
    let callbacks = {
      new: this.onNew.bind(this),
      open: this.onOpen.bind(this),
      save: this.onSave.bind(this),
      delete: this.onDelete.bind(this),
      run: this.onRun.bind(this),
      stop: this.onStop.bind(this),
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
