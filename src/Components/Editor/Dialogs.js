import React, { Component } from 'react';
import {
  Modal, Button, FormGroup, FormControl, ControlLabel, HelpBlock,
  ListGroup, ListGroupItem
} from 'react-bootstrap';

class SaveDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      reserved: new Set(),
      title: '',
      identifier: '',
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

  open(title, identifier, reserved, callbackOK, callbackCancel) {
    this.setState({
      showModal: true,
      title: title,
      identifier: identifier,
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
    this.state.callbackOK(this.state.title, this.state.identifier);
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
    return 'success';
  }

  changeTitle(e) {
    this.setState({ title: e.target.value });
  }

  changeType(e) {
    this.setState({ identifier: e.target.value });
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Save subgraph</Modal.Title>
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

              <FormGroup controlId="identifier" validationState={this.validateType()}>
                <ControlLabel>Identifier</ControlLabel>
                <FormControl type="text"
                             value={this.state.identifier}
                             placeholder="identifier"
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
            <Button bsStyle="primary" onClick={this.onOK}>
            {
              this.state.reserved.has(this.state.identifier) ? 'Overwrite' : 'Save'
            }
            </Button>
          </Modal.Footer>

        </Modal.Dialog>
        ): null}
      </div>
    );
  }
}

class OpenDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      items: [],
      callbackOK: function() {},
      callbackCancel: function() {},
    };

    this.open = this.open.bind(this);
    this.onOK = this.onOK.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  open(items, callbackOK, callbackCancel) {
    this.setState({
      showModal: true,
      items: items,
      callbackOK: callbackOK,
      callbackCancel: callbackCancel
    });
  }

  onOK(e) {
    let selection = e.target.dataset.identifier;
    this.setState({
      showModal: false
    });
    this.state.callbackOK(selection);
  }

  onCancel() {
    this.setState({
      showModal: false
    });
    this.state.callbackCancel();
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Open subgraph</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <ListGroup>
              {
                this.state.items.length === 0 && 'You have no saved subgraphs :('
              }
              {
                this.state.items.map(
                  item =>
                  <ListGroupItem onClick={this.onOK} key={item} data-identifier={item}>
                    {item}
                  </ListGroupItem>)
              }
            </ListGroup>

          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="default" onClick={this.onCancel}>Cancel</Button>
          </Modal.Footer>

        </Modal.Dialog>
        ): null}
      </div>
    );
  }
}

class DeleteDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      name: "",
      callbackOK: function() {},
      callbackCancel: function() {},
    };

    this.open = this.open.bind(this);
    this.onOK = this.onOK.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  open(name, callbackOK, callbackCancel) {
    this.setState({
      showModal: true,
      name: name,
      callbackOK: callbackOK,
      callbackCancel: callbackCancel
    });
  }

  onOK(e) {
    this.setState({
      showModal: false
    });
    this.state.callbackOK();
  }

  onCancel() {
    this.setState({
      showModal: false
    });
    this.state.callbackCancel();
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Delete subgraph</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Are you sure you want to delete {this.name}?
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle="default" onClick={this.onCancel}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.onOK}>Confirm</Button>
          </Modal.Footer>

        </Modal.Dialog>
        ): null}
      </div>
    );
  }
}

class MessageDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      title: '',
      message: ''
    };

    this.open = this.open.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  open(title, message) {
    this.setState({
      showModal: true,
      title: title,
      message: message
    });
  }

  onDismiss() {
    this.setState({
      showModal: false
    });
  }

  render() {
    return (
      <div>
        {this.state.showModal ? (
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>{this.state.message}</Modal.Body>

          <Modal.Footer>
            <Button bsStyle="default" onClick={this.onDismiss}>Dismiss</Button>
          </Modal.Footer>

        </Modal.Dialog>
        ): null}
      </div>
    );
  }
}

export { OpenDialog, SaveDialog, DeleteDialog, MessageDialog };
