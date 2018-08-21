import Service from './Service';

let sampleKernels = [
  {
    "category": "kernel",
    "inputs": [{"name": "input"}],
    "title": "Transposed Conv2D",
    "outputs": [{"name": "output"}],
    "attributes": [
      {"type": "int", "name": "filters", "value": "128"},
      {"type": "int", "name": "kernel_size", "value": "3"},
      {"type": "int", "name": "strides", "value": "1"}
    ],
    "identifier": "tconv2d",
    "public": true
  },
  {
    "category": "kernel",
    "inputs": [{"name": "input"}],
    "title": "Conv2D",
    "outputs": [{"name": "output"}],
    "attributes": [
      {"type": "int", "name": "filters", "value": "128"},
      {"type": "int", "name": "kernel_size", "value": "3"},
      {"type": "int", "name": "strides", "value": "1"}
    ],
    "identifier": "conv2d",
    "public": true
  }
];

class CatalogService extends Service {
  constructor() {
    super();
    this.items = {
      kernel: sampleKernels,
      graph: []
    };
    this.fetchCatalog();
  }

  fetchCatalog() {
    this.publish(this.items);
    // fetch('/api/doc/list', {
    //   method: 'POST',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json'
    //   }),
    //   body: "{}",
    //   credentials: 'same-origin'
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     throw Error('Failed to fetch user information.')
    //   }
    //   return response;
    // })
    // .then(d => d.json())
    // .then(items => {
    //   this.items.kernel = items.filter(d => d.category === 'kernel');
    //   this.items.graph = items.filter(d => d.category === 'graph');
    //   this.publish(this.items);
    // }).catch(() => {});
  }

  getIdentifiers(category) {
    return this.items[category].map(p => p.identifier);
  }

  getItems(category, filter=null) {
    let items = this.items[category];
    if (filter) {
      let re = new RegExp(filter, 'i');
      items = items.filter(function(d) {
        return d.title.match(re) != null
      });
    }
    items = items.sort(
      (a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
    return items;
  }

  getItemByIdentifier(category, identifier) {
    return this.items[category].find(d => d.identifier === identifier);
  }

  add(category, item, errorCallback=null) {
    this.remove(category, item);
    let items = this.items[category];
    item["public"] = false;
    items.push(item);

    // fetch('/api/doc/save', {
    //   method: 'POST',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //   }),
    //   body: JSON.stringify(item),
    //   credentials: 'same-origin'
    // })
    // .then(response => {
    //   if (!response.ok && errorCallback) {
    //     errorCallback();
    //   }
    // });

    this.publish(this.items);
  }

  remove(category, item, errorCallback=null) {
    let items = this.items[category];
    for (let i in items) {
      if (items[i].identifier === item.identifier) {
        items.splice(i, 1);
        break;
      }
    }

    // fetch('/api/doc/delete', {
    //   method: 'POST',
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //   }),
    //   body: JSON.stringify(item),
    //   credentials: 'same-origin'
    // })
    // .then(response => {
    //   if (!response.ok && errorCallback) {
    //     errorCallback();
    //   }
    // });

    this.publish(this.items);
  }
}

let theCatalogService = new CatalogService();

export default theCatalogService;
