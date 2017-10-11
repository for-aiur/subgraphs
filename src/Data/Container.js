import {Container} from 'flux/utils';
import Graph from '../Components/Graph';
import Store from './Store';

function getStores() {
  return [
    Store,
  ];
}

function getState() {
  return {
    state: Store.getState(),
  };
}

export default Container.createFunctional(Graph, getStores, getState);
