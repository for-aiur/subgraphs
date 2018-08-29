import React, { Component } from 'react';

class Sandbox extends Component {
  constructor(props) {
    super(props);

    this.counter = 1;
    this.callbacks = {};
  }

  uniqueId() {
    return this.counter++;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.reset();

    window.addEventListener('message', this.receiveMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage, false);
  }

  receiveMessage = (event) => {
    if (event.data.id === undefined &&
        event.data.result === undefined) {
      return;
    }
    let id = event.data.id;
    let result = event.data.result;
    this.callbacks[id](result);
    delete this.callbacks[id];
  }

  eval(code) {
    let id = this.uniqueId();
    let promise = new Promise((resolve, reject) => {
      this.callbacks[id] = resolve;
    });
    this.ifr.contentWindow.postMessage({id, code, method: 'eval'}, '*');
    return promise;
  }

  call(code, ...args) {
    let id = this.uniqueId();
    let promise = new Promise((resolve, reject) => {
      this.callbacks[id] = resolve;
    });
    this.ifr.contentWindow.postMessage({id, code, args, method: 'call'}, '*');
    return promise;
  }

  reset() {
    let script = `
    function receiveMessage(event) {
      let id = event.data.id;
      let result;
      if (event.method == 'eval')
        result = eval(event.data.code);
      else
        result = (new Function(...args, code))();
      window.parent.postMessage({id, result}, '*');
    }
    window.addEventListener('message', receiveMessage, false);
    `;
    let html = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/0.12.5/tf.min.js" integrity="sha256-Eq2OUrnzn5xiSxQGei/aKxQnPQR4zrQKoMk4TKlLWBU=" crossorigin="anonymous"></script>
    <script>${script}</script>
    `;
    this.ifr.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  }

  render() {
    return (
      <iframe ref={(p) => this.ifr = p}
              title="Sandbox"
              sandbox="allow-scripts"
              style={{display: 'none'}}>
      </iframe>
    );
  }
}

export default Sandbox;
