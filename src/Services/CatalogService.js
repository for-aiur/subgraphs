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
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }),
      body: "{}",
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok) {
        throw Error('Failed to fetch user information.')
      }
      return response;
    })
    .then(d => d.json())
    .then(items => {
      this.items.kernels = items.filter(d => d.category === 'kernel');
      this.items.compositions = items.filter(d => d.category === 'composition');
      this.publish(this.items.kernels);
    }).catch(() => {});
  }

  getIdentifiers(category) {
    return this.items[category].map(p => p.identifier);
  }

  getItems(category) {
    return this.items[category];
  }

  getItemByIdentifier(category, identifier) {
    return this.items[category].find(d => d.identifier === identifier);
  }

  add(category, item, errorCallback=null) {
    this.remove(category, item);
    let items = this.items[category];
    item["public"] = false;
    items.push(item);

    fetch('/api/doc/save', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(item),
      credentials: 'same-origin'
    })
    .then(response => {
      if (!response.ok && errorCallback) {
        errorCallback();
      }
    });
  }

  remove(category, item, errorCallback=null) {
    let items = this.items[category];
    for (let i in items) {
      if (items[i].identifier === item.identifier) {
        items.splice(i, 1);
        break;
      }
    }

    fetch('/api/doc/delete', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(item),
      credentials: 'same-origin'
    })    
    .then(response => {
      if (!response.ok && errorCallback) {
        errorCallback();
      }
    });
  }
}

let theCatalogService = new CatalogService();

export default theCatalogService;
