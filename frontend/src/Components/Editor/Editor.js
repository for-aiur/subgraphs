import React, { Component } from 'react';
import GraphEditor from './GraphEditor'
import CodeEditor from './CodeEditor'
import Menu from './Menu'
import TabsBar from './TabsBar';
import { NewDialog, OpenDialog, SaveDialog, DeleteDialog, MessageDialog } from './Dialogs';
import Sandbox from './Sandbox';
import theCatalogService from '../../Services/CatalogService'
import Node from '../../Graph/Node';
import * as Utils from '../../Common/Utils';
import './Editor.css';

const modes = {
  NONE: 'none',
  GRAPH: 'graph',
  CODE: 'code'
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

  componentDidMount() {
    this.setState({});
  }

  get mode() {
    if (this.state.scope === null) {
      return modes.NONE;
    } else if (this.state.scope.category === Node.categories.GRAPH) {
      return modes.GRAPH;
    } else if (this.state.scope.category === Node.categories.KERNEL) {
      return modes.CODE;
    }
  }

  uniqueIdentifier(identifier, category) {
    let identifiers = this.state.openNodes.map(d => d.identifier).concat(
      theCatalogService.getIdentifiers(category));
    return Utils.uniqueName(identifier, identifiers);
  }

  onNew = () => {
    this.newDialog.open(
      {
        graph: 'Graph',
        kernel: 'Kernel'
      },
      (category) => {
        this.onNewSubgraph(category);
      },
      () => {});
  };

  onNewSubgraph = (category) => {
    let node = new Node('New Project',
                        this.uniqueIdentifier('project', category),
                        null, category);
    let openNodes = this.state.openNodes;
    openNodes.push(node);
    this.setState({
      scope: node,
      openNodes: openNodes
    });
  };

  onOpen = () => {
    this.openDialog.open(
      [
        {
          'title': 'Kernel',
          'category': Node.categories.KERNEL,
          'items': theCatalogService.getIdentifiers(Node.categories.KERNEL),
        },
        {
          'title': 'Graph',
          'category': Node.categories.GRAPH,
          'items': theCatalogService.getIdentifiers(Node.categories.GRAPH),
        }
      ],
      (category, identifier) => {
        let p = theCatalogService.getItemByIdentifier(
          category, identifier);
        p = Object.assign(new Node(), p).clone();
        this.onOpenSubgraph(p);
      },
      () => {});
  };

  onOpenSubgraph = (p) => {
    let openNodes = this.state.openNodes;
    let i = openNodes.findIndex(q => q.identifier === p.identifier);
    if (i >= 0) {
      openNodes.splice(i, 1);
    }
    openNodes.push(p);
    if (this.state.scope !== null) {
      this.editor.updateScope();
      this.state.scope.pruneEdges();
    }
    this.setState({
      scope: p,
      openNodes: openNodes
    });
  };

  onClose = (p) => {
    if (p === null) {
      this.messageDialog.open('Error', 'Invalid action.');
      return;
    }
    let openNodes = this.state.openNodes;
    let i = openNodes.indexOf(p);
    openNodes.splice(i, 1);
    this.setState({openNodes: openNodes});
    if (this.state.scope === p) {
      if (openNodes.length === 0) {
        this.onSetScope(null);
      } else {
        this.onSetScope(openNodes[Math.max(0, i - 1)]);
      }
      return;
    }
  };

  onSave = (p=null, onOK=null, onCancel=null) => {
    if (p === null) {
      p = this.state.scope;
      if (p === null) {
        this.messageDialog.open('Error', 'Invalid action.');
        return;
      }
    }

    this.editor.updateScope();
    p.pruneEdges();

    this.saveDialog.open(
      p.title,
      p.identifier,
      new Set(theCatalogService.getIdentifiers(p.category)),
      (title, identifier) => {
        p.title = title;
        p.identifier = identifier;
        theCatalogService.add(p.toTemplate(), () => {
          this.messageDialog.open(
            'Error', 'Failed to communicate with the server. '+
            'Perhaps you are not logged in?');
        });
        if (onOK) onOK();
        this.setState({scope: p});
      },
      () => {
        if (onCancel) onCancel();
      });
  };

  onDelete = () => {
    if (this.state.scope === null) {
      this.messageDialog.open('Error', 'Invalid action.');
      return;
    }
    let existing = theCatalogService.getItemByIdentifier(
      this.state.scope.category, this.state.scope.identifier);
    if (!existing) {
      this.onClose(this.state.scope);
      return;
    }
    this.deleteDialog.open(
      this.state.scope.identifier,
      () => {
        this.onClose(this.state.scope);
        theCatalogService.remove(this.state.scope, () => {
          this.messageDialog.open(
            'Error', 'Failed to communicate with the server. '+
            'Perhaps you are not logged in?');
        });
      },
      () => {}
    );
  };

  onRun = () => {
    if (this.state.scope === null) {
      this.messageDialog.open('Error', 'Invalid action.');
      return;
    }

    this.state.scope.run(this.sandbox);
  };

  onStop = () => {
    if (this.state.scope === null) {
      this.messageDialog.open('Error', 'Invalid action.');
      return;
    }
  };

  onSetScope = (p) => {
    if (this.state.scope !== null) {
      this.editor.updateScope();
      this.state.scope.pruneEdges();
    }
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
      <div id="editor-container">
        <Sandbox ref={p => this.sandbox = p} />
        <NewDialog ref={p => this.newDialog = p} />
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
        <div className="editor">
        {
          this.mode === modes.GRAPH &&
          <GraphEditor ref={p => this.editor = p}
                       scope={this.state.scope}
                       onOpenSubgraph={this.onOpenSubgraph} />
        }
        {
          this.mode === modes.CODE &&
          <CodeEditor ref={p => this.editor = p}
                      scope={this.state.scope}
                      sandbox={this.sandbox} />
        }
        </div>
      </div>
    );
  }
}

export default Editor;
