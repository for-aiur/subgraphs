import React, { Component } from 'react';
import { 
  Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock
} from 'react-bootstrap';

class NewDialog extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      showModal: false,
      reserved: new Set(),
      title: '',
      type: '',
      callbackOK: function() {},
      callbackCancel: function() {},
    };

    this.open = this.open.bind(this);
    this.onOK = this.onOK.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.validateTitle = this.validateTitle.bind(this);
    this.validateType = this.validateType.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeType = this.changeType.bind(this);
  }
  
  open(title, type, reserved, callbackOK, callbackCancel) {
    this.setState({ 
      showModal: true,
      title: title,
      type: type,
      reserved: reserved,
      callbackOK: callbackOK,
      callbackCancel: callbackCancel
    });
  }

  onOK() {
    if (this.validateTitle() === 'error' || 
        this.validateType() === 'error') return;
    this.setState({ 
      showModal: false 
    });
    this.state.callbackOK(this.state.title, this.state.type);
  }

  onCancel() {
    this.setState({ 
      showModal: false 
    });
    this.state.callbackCancel();
  }

  validateTitle() {
    if (this.state.title.length < 3) return 'error';
    return 'success';
  }

  validateType() {
    if (this.state.title.length < 3) return 'error';
    if (this.state.reserved.has(this.state.type)) return 'error';
    return 'success';
  }

  changeTitle(e) {
    this.setState({ title: e.target.value });
  }
  
  changeType(e) {
    this.setState({ type: e.target.value });
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Create subgraph</Modal.Title>
          </Modal.Header>
    
          <Modal.Body>

            <form>
              <FormGroup controlId="title" validationState={this.validateTitle()}>
                <ControlLabel>Title</ControlLabel>
                <FormControl type="text" 
                             value={this.state.title}
                             placeholder="Title" 
                             onChange={this.changeTitle} />
                <FormControl.Feedback />
                <HelpBlock>
                  Human readable name for the subgraph.
                </HelpBlock>
              </FormGroup>

              <FormGroup controlId="type" validationState={this.validateType()}>
                <ControlLabel>Identifier</ControlLabel>
                <FormControl type="text" 
                             value={this.state.type}
                             placeholder="type" 
                             onChange={this.changeType} />
                <FormControl.Feedback />
                <HelpBlock>
                  The unique identifier must be consisted of alphanumerics with no 
                  special characters.
                </HelpBlock>
              </FormGroup>
            </form>

          </Modal.Body>
    
          <Modal.Footer>
            <Button bsStyle="default" onClick={this.onCancel}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.onOK}>OK</Button>
          </Modal.Footer>
    
        </Modal.Dialog>
        ): null}
      </div>
    );
  }
}

export { NewDialog };
