import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CodeEditor.css'

class CodeEditor extends Component {
  static propTypes = {
    scope: PropTypes.object,
  };

  componentDidMount() {
    this.editor = window.ace.edit(this.container, {
      mode: "ace/mode/javascript",
      selectionStyle: "text",
      theme: "ace/theme/clouds",
      showPrintMargin: false
    });
    this.editor.focus();
    this.editor.setValue(this.props.scope.code);
  }

  componentDidUpdate() {
    this.editor.setValue(this.props.scope.code);
  }

  updateScope = () => {
    this.props.scope.code = this.editor.getValue();
  };

  render() {
    return (
      <div id="ce-container" ref={p => this.container = p}>
      </div>
    );
  }
}

export default CodeEditor;
