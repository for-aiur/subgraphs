import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

class About extends Component {
  render() {
    return (
      <div>

        <header className="masthead">
          <div className="container">
            <img className="img-fluid" src="favicon.ico" alt="" />
            <div className="intro-text">
              <span className="name">Subgraphs</span>
              <span className="subtitle">A Deep Learning IDE</span>
            </div>
            <div className="start">
              <Link to="/" className="btn btn-lg btn-primary">Start</Link>
            </div>
          </div>
        </header>

        <section>
          <div className="container">
            <div className="row">
              <div className="col-lg-12 text-center">
                <p className="lead">
                  Subgraphs is a visual IDE for developing computational graphs, particularly
                  designed for deep neural networks. Subgraphs aims to enable users with
                  no programming experience easily develop machine learning models.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    );
  }
}

export default About;
