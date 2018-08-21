import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CodeEditor.css'

class CodeEditor extends Component {
  static propTypes = {
    content: PropTypes.string,
  };

  static defaultProps = {
    code: '//write your code here',
  };

  openSubgraph(p) {
  }

  closeSubgraph(p) {
  }

  saveSubgraph(p, onOK=null, onCancel=null) {
  }

  deleteSubgraph() {
  }

  componentDidMount(){
    this.editor = window.ace.edit(this.container, {
      mode: "ace/mode/javascript",
      selectionStyle: "text",
      theme: "ace/theme/clouds",
      showPrintMargin: false
    });
  }

  render() {
    return (
      <div id="container" ref={p => this.container = p}>
        {this.props.code}
      </div>
    );
  }
}

export default CodeEditor;
