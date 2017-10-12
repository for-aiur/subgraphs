import * as catalogJSON from './catalog.json';

class Catalog {
  constructor() {
    this.commonItems = catalogJSON;
    this.userItems = [];
  }

  create() {
  }

  add(node) {
    this.commonItems.push(node);
  }

  remove(node) {
    let index = this.items.indexOf(node);
    this.userItems.splice(index, 1);
  }
}

export default Catalog;
