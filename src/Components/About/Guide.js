import React, { Component } from 'react';

class Guide extends Component {
  render() {
    return (
      <div className="container">
        <div>
          <h1 className="text-center">Quick Start</h1>
        </div>
        <br />

        <div>
          <h2 className="text-center">Login</h2>
          <p className="lead">
            You can use the editor without logging in, but all of your changes will be
            discarded when you leave the session. So make sure to login before starting
            a new project.
          </p>
        </div>

        <div>
          <h2 className="text-center">Creating subgraphs</h2>
          <p className="lead">
            Click on the new button to create an empty subgraph. You can then specify
            a title and a name for your subgraph. Make sure to specify a unique 
            identifier for your subgraphs. You can only use alphanumerical characters
            and underline for the identifier name.
          </p>
          <p className="text-center">
            <img src="https://i.imgur.com/oOoMGg6.gif" alt="" />
          </p>
        </div>

        <div>
          <h2 className="text-center">Inserting nodes</h2>
          <p className="lead">
            Simply drag and drop nodes from the catalog to the canvas and specify 
            its attributes. You can then connect the nodes by dragging the ports.
          </p>
          <p className="text-center">
            <img src="https://i.imgur.com/jjdZrAH.gif" alt="" />
          </p>
        </div>

        <div>
          <h2 className="text-center">Making reusable subgraphs</h2>
          <p className="lead">
            You can expose any subgraph's internal attributes and ports so that it can be 
            reused in different places. Select a node, and go to property view on the
            right. Press "external" to expose the port or attribute. You can further
            specify an alias for the port or attribute name.
          </p>
          <p className="text-center">
            <img src="https://i.imgur.com/B2d8IPn.gif" alt="" />
          </p>
        </div>

        <div>
          <h2 className="text-center">Terminal nodes</h2>
          <p className="lead">
            Ops won't get executed by default. In order to run ops, they have to be
            connected to a terminal node. "Run" node is a terminal that will be executed
            at each iteration. It's usually connected to the training op in the graph.
            "Summary" nodes get executed every few iterations, and the output of them
            will be visualized on TensorBoard.
          </p>
          <p className="text-center">
            <img src="https://i.imgur.com/m7GRNNP.gif" alt="" />
          </p>
        </div>

        <div>
          <h2 className="text-center">Running subgraphs</h2>
          <p className="lead">
            In order to run your models you will need to download and the client application.
            Follow the instructions from <a href="https://github.com/vahidk/subgraphs">here</a>.
          </p>
        </div>

        <br />
        <hr />
        <br />

      </div>
    );
  }
}

export default Guide;
