import * as catalogJSON from './catalog.json';

class Catalog {
  constructor() {
    this.items = {
      common: catalogJSON,
      user: []
    };
  }

  getTypes(category) {
    return this.items[category].map(p => p.type);
  }

  getItems(category) {
    return this.items[category];
  }

  add(category, item) {
    this.remove(category, item);
    let items = this.items[category];
    items.push(item);
  }

  remove(category, item) {
    let items = this.items[category];
    for (let i in items) {
      if (items[i].type === item.type) {
        items.splice(i, 1);
        break;
      }
    }
  }
}

export default Catalog;
