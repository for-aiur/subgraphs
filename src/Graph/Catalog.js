import * as catalogJSON from './catalog.json';

class Catalog {
  constructor() {
    this.items = {
      kernels: catalogJSON,
      compositions: []
    };
  }

  getTypes(category) {
    return this.items[category].map(p => p.type);
  }

  getItems(category) {
    return this.items[category];
  }

  getItemByType(category, type) {
    return this.items[category].find(d => d.type === type);
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
