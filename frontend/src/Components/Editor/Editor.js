import React, { Component } from 'react';
import GraphEditor from './GraphEditor'
import CodeEditor from './CodeEditor'
import Menu from './Menu'
import TabsBar from './TabsBar';
import { OpenDialog, SaveDialog, DeleteDialog, MessageDialog } from './Dialogs';
import theCatalogService from '../../Services/CatalogService'
import Node from '../../Graph/Node';
import * as Utils from '../../Common/Utils';
import './Editor.css';

const mode = {
  GRAPH: 0,
  CODE: 1
};

class Editor extends Component {
  constructor(props) {
    super(props);

    let scope = new Node('New Project', 'project0');
    this.state = {
      scope: scope,
      openNodes: [scope]
    };
  }

  get mode() {
    return mode.GRAPH;
  }

  uniqueIdentifier(identifier) {
    let identifiers = this.state.openNodes.map(d => d.identifier).concat(
      theCatalogService.getIdentifiers('compositions'));
    return Utils.uniqueName(identifier, identifiers);
  }

  onNew = () => {
    let node = new Node('New Project', this.uniqueIdentifier('project'));
    let openNodes = this.state.openNodes;
    openNodes.push(node);
    this.setState({
      scope: node,
      openNodes: openNodes
    });
  };

  onOpen = () => {
    this.openDialog.open(
      theCatalogService.getIdentifiers('compositions'),
      (identifier) => {
        let p = theCatalogService.getItemByIdentifier(
          'compositions', identifier);
        p = Object.assign(new Node(), p).clone();
        let openNodes = this.state.openNodes;
        let i = openNodes.findIndex(q => q.identifier === p.identifier);
        if (i >= 0) {
          openNodes.splice(i, 1);
        }
        openNodes.push(p);
        this.state.scope.pruneEdges();
        this.setState({
          scope: p,
          openNodes: openNodes
        });
      },
      () => {});
  };

  onClose = (p) => {
    let openNodes = this.state.openNodes;
    let i = openNodes.indexOf(p);
    openNodes.splice(i, 1);
    if (this.state.scope === p) {
      if (openNodes.length === 0) {
        this.setState({openNodes: openNodes});
        this.onNew();
      } else {
        this.state.scope.pruneEdges();
        this.setState({
          scope: openNodes[Math.max(0, i - 1)],
          openNodes: openNodes
        });
      }
      return;
    }
  };

  onSave = (p=null, onOK=null, onCancel=null) => {
    if (p === null) {
      p = this.state.scope;
    }

    this.saveDialog.open(
      p.title,
      p.identifier,
      new Set(theCatalogService.getIdentifiers('compositions')),
      (title, identifier) => {
        p.title = title;
        p.identifier = identifier;
        theCatalogService.add('compositions', p.toTemplate(), () => {
          this.messageDialog.open(
            'Error', 'Failed to communicate with the server. '+
            'Perhaps you are not logged in?');
        });
        if (onOK) onOK();
      },
      () => {
        if (onCancel) onCancel();
      });
  };

  onDelete = () => {
    let existing = theCatalogService.getItemByIdentifier(
      'compositions', this.state.scope.identifier);
    if (!existing) {
      let p = this.state.scope;
      this.onClose(p);
      return;
    }
    this.deleteDialog.open(
      this.state.scope.identifier,
      () => {
        let p = this.state.scope;
        this.onClose(p);
        theCatalogService.remove('compositions', p, () => {
          this.messageDialog.open(
            'Error', 'Failed to communicate with the server. '+
            'Perhaps you are not logged in?');
        });
      },
      () => {}
    );
  };

  onRun = () => {
    let identifier = this.state.scope.identifier;
    if (!theCatalogService.getItemByIdentifier('compositions', identifier)) {
      this.messageDialog.open(
        'Error', 'Current project is not saved.');
      return;
    }
  };

  onStop = () => {
    // let identifier = this.state.scope.identifier;
  };

  onSetScope = (p) => {
    this.state.scope.pruneEdges();
    this.setState({
      scope: p
    });
  }

  onChangeIdentifier = () => {
    this.setState({openNodes: this.state.openNodes});
  }

  render() {
    let callbacks = {
      new: this.onNew,
      open: this.onOpen,
      save: this.onSave,
      delete: this.onDelete,
      run: this.onRun,
      stop: this.onStop,
    };

    return (
      <div className="app">
        <OpenDialog ref={p => this.openDialog = p} />
        <SaveDialog ref={p => this.saveDialog = p} />
        <DeleteDialog ref={p => this.deleteDialog = p} />
        <MessageDialog ref={p => this.messageDialog = p} />
        <div className="menu">
          <Menu ref={p => this.menu = p} callbacks={callbacks} />
        </div>
        <div className="tabsBar">
          <TabsBar scope={this.state.scope}
                   openNodes={this.state.openNodes}
                   onSetScope={this.onSetScope}
                   onSaveSubgraph={this.onSave}
                   onCloseSubgraph={this.onClose} />
        </div>
        {
          this.mode === mode.GRAPH ?
          <div className="editor">
            <GraphEditor ref={p => this.editor = p}
                         scope={this.state.scope} />
          </div>
          :
          <div className="editor">
            <CodeEditor ref={p => this.editor = p}
                        scope={this.state.scope} />
          </div>
        }
      </div>
    );
  }
}

export default Editor;
