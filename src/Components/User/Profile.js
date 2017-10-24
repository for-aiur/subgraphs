import React, { Component } from 'react';
import theUserService from '../../Services/UserService.js';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.user;

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.showUID = this.showUID.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    theUserService.updateUser(this.state);
  }

  onChange(e) {
    var val;
    if (e.target.type === 'text') {
      val = e.target.value;
    } else {
      val = e.target.checked;
    }
    this.setState({
      [e.target.name]: val
    });
  }

  showUID() {
    if (this.uid.type === 'text') {
      this.uid.type = 'password';
      this.revealButton.innerText = 'Reveal';
    } else {
      this.uid.type = 'text';
      this.revealButton.innerText = 'Hide';
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.user);
  }

  render() {
    return (
      <div className="container">

        <div className="page-header">
          <h3>
            <span className="fa fa-user" aria-hidden="true"></span>&nbsp;
            Profile
          </h3>
        </div>   

        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <div className="form-group">
            <label className="col-sm-3 control-label">Name</label>
            <div className="col-sm-5">
              <input type="text" size="20" className="form-control" 
                     placeholder="name" name="name" required 
                     value={this.state.name || '' }
                     onChange={this.onChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label">Newsletter</label>
            <div className="col-sm-5">
              <input type="checkbox" name="subscribed" 
                     checked={this.state.subscribed || ''}
                     onChange={this.onChange} />
            </div>
          </div>
          <input type="hidden" name="uid" value={this.state.uid || ''} />
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-5">
              <button type="submit" className="btn btn-default">Save</button>
            </div>
          </div>
        </form>

        <hr className="separator" />

        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label">UID</label>
            <div className="col-sm-5">
              <input type="password" size="100" className="form-control" readOnly
                     value={this.state.uid || '' } 
                     ref={p => this.uid = p} />
            </div>
            <div className="col-sm-4">
              <button type="button" className="btn btn-default"
                      onClick={this.showUID}
                      ref={p => this.revealButton = p}>Reveal</button>
            </div>
          </div>
        </form>

      </div>
    )
  }
}

export default Profile;
