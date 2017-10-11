import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import ActionTypes from './ActionTypes';
import Dispatcher from './Dispatcher';

class Store extends ReduceStore {
  constructor() {
    super(Dispatcher);
  }

  getInitialState() {
    return Immutable.OrderedMap();
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.NEW_GRAPH:
        // New graph logic
        return state;
      case ActionTypes.LOAD_GRAPH:
        // Load graph logic
        return state;
      case ActionTypes.SAVE_GRAPH:
        // Save graph logic
        return state;
      default:
        return state;
    }
  }
}

export default new Store();
