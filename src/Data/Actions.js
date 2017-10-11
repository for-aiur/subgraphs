import Dispatcher from './Dispatcher';
import ActionTypes from './ActionTypes';

const Actions = {
  newGraph() {
    Dispatcher.dispatch({type: ActionTypes.NEW_GRAPH});
  },
  loadGraph() {
    Dispatcher.dispatch({type: ActionTypes.LOAD_GRAPH});
  },
  saveGraph() {
    Dispatcher.dispatch({type: ActionTypes.SAVE_GRAPH});
  },
};

export default Actions;

