import React, { Component } from 'react';
import './Sandbox.css';

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
    let data = event.data;
    if (data.id === undefined) return;
    let id = data.id;
    let result = data.result;
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
    var app = {};
    function frameReceiveMessage(event) {
      if (event.data.id === undefined) return;
      let id = event.data.id;
      let code = event.data.code
      let result;
      try {
        if (event.data.method == 'eval') {
          eval(code);
        } else {
          result = (new Function(...event.data.args, code))();
        }
      } catch (e) {
        console.log('context', app);
        console.log('code', code);
        console.error(e.name + ':' + e.message);
      }
      window.parent.postMessage({id, result}, '*');
    }
    window.addEventListener('message', frameReceiveMessage, false);
    `;
    let html = `
    <html>
    <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/tensorflow/0.12.5/tf.min.js" integrity="sha256-Eq2OUrnzn5xiSxQGei/aKxQnPQR4zrQKoMk4TKlLWBU=" crossorigin="anonymous"></script>
    <script>${script}</script>
    </head>
    <body></body>
    </html>
    `;
    this.ifr.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  }

  render() {
    return (
      <iframe ref={(p) => this.ifr = p}
              title="Sandbox"
              sandbox="allow-scripts"
              className="sandbox">
      </iframe>
    );
  }
}

export default Sandbox;
