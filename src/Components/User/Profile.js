import React, { Component } from 'react'

class Profile extends Component {
  render() {
    return (
      <div className="container">

        <div className="page-header">
          <h3>
            <span className="fa fa-user" aria-hidden="true"></span>
            Profile
          </h3>
        </div>   

        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-3 control-label">Name</label>
            <div className="col-sm-5">
              <input type="text" size="100" className="form-control" 
                    placeholder="name" name="name" required />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label">Newsletter</label>
            <div className="col-sm-5">
              <input type="checkbox" size="100" name="subscribed" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-5">
              <button type="submit" className="btn btn-default">Save</button>
            </div>
          </div>
        </form>

      </div>
    )
  }
}

export default Profile;
