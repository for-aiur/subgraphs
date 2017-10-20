import Service from './Service';

class CatalogService extends Service {
  constructor() {
    super();
    this.items = {
      kernels: [],
      compositions: []
    };
    this.fetchCatalog();
  }

  fetchCatalog() {
    fetch('/api/doc/list', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json'
      }),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        throw Error('Failed to fetch user information.')
      }
      return response;
    })
    .then(d => d.json())
    .then(d => {
      this.items.kernels = d;
      this.publish(this.items);
    });
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

let theCatalogService = new CatalogService();

export default theCatalogService;
