import Service from './Service';
import theUserService from './UserService';

class CommandService extends Service {
  constructor() {
    super();
    this.responses = {};

    this.fetchCommands = this.fetchCommands.bind(this);
    this.fetchCommands();
    // setInterval(this.fetchCommands, 1000);
  }

  fetchCommands() {
    if (!theUserService.isLoggedIn) {
      return;
    }

    fetch('/api/cmd/list', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      body: JSON.stringify({
        'category': 'response'
      }),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        throw Error('Failed to fetch commands.')
      }
      return response;
    })
    .then(d => d.json())
    .then(d => {
      this.responses[d.identifier] = d;
      this.publish(d);
    }, d => {
    });
  }

  sendCommand(cmd, errorCallback=null) {
    cmd['category'] = 'query';

    fetch('/api/cmd/save', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(cmd),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok && errorCallback) {
        errorCallback();
      }
    });
  }

  get isLoggedIn() {
    return this.user.uid !== undefined;
  }
}

let theCommandService = new CommandService();

export default theCommandService;
