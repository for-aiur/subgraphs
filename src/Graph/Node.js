import * as Utils from '../Common/Utils';
import Edge from './Edge';
import Port from './Port';

class Node {
  constructor(title=null, type=null, name=null) {
    this.title = title;
    this.name = name;
    this.type = type;
    this.id = Utils.generateUID();
    this.position = {x: 0, y: 0};
    this.inputs = [];
    this.outputs = [];
    this.attributes = [];
    this.nodeData = [];
    this.edgeData = [];
  }

  uniqueName(name) {
    let suffixes = new Set();
    for (let d of this.nodeData) {
      if (d.name.startsWith(name)) {
        suffixes.add(d.name.substr(name.length));
      }
    }
    let i = 0;
    while (suffixes.has(i.toString())) { i++; }
    return name + i;
  }

  clone() {
    let d = new Node();
    d.title = this.title;
    d.name = this.name;
    d.type = this.type;
    d.id = this.id;
    d.position = Utils.clone(this.position);
    d.inputs = Utils.clone(this.inputs);
    d.outputs = Utils.clone(this.outputs);
    d.attributes = Utils.clone(this.attributes);
    d.nodeData = [];
    for (let node of this.nodeData) {
      d.nodeData.push(node.clone());
    }
    d.edgeData = [];
    for (let edge of this.edgeData) {
      d.edgeData.push(edge.clone());
    }
    return d;
  }

  fromTemplate(template, pos) {
    let d = Object.assign(new Node(), template).clone();
    d.name = this.uniqueName(template.type);
    d.position = pos;
    for (let side of ['inputs', 'outputs']) {
      for (let i in d[side]) {
        d[side][i].id = new Port(d.id, side, i).id;
        d[side][i].edges = new Set();
        d[side][i].alias = null;
      }
    }
    for (let attr of d.attributes) {
      attr.alias = null;
    }
    return d;
  }

  toTemplate() {
    let d = this.clone();
    delete d.id;
    delete d.name;
    delete d.position;
    for (let side of ['inputs', 'outputs']) {
      for (let i in d[side]) {
        delete d[side][i].id;
        delete d[side][i].edges;
        delete d[side][i].alias;
      }
    }
    for (let attr of d.attributes) {
      delete attr.alias;
    }
    return d;
  }

  addNode(d) {
    this.nodeData.push(d);
  }

  removeNode(nodeDatum) {
    let nodeId = nodeDatum.id;
    let i = this.edgeData.length;
    while (i--) {
      let d = this.edgeData[i];
      if (Port.fromId(d.source).nodeId === nodeId ||
        Port.fromId(d.target).nodeId === nodeId) {
        this.edgeData.splice(i, 1);
      }
    }

    let nodeIdx = this.nodeData.indexOf(nodeDatum);
    this.nodeData.splice(nodeIdx, 1);
  }

  addEdge(srcId, tarId) {
    let d = new Edge(srcId, tarId);
    let edgeId = d.id;
    if (this.getEdgeById(edgeId) !== undefined) {
      return;
    }
    this.getPortById(srcId).edges.add(edgeId);
    this.getPortById(tarId).edges.add(edgeId);
    this.edgeData.push(d);
  }

  removeEdge(edgeDatum) {
    let edgeIdx = this.edgeData.indexOf(edgeDatum);
    let edgeId = edgeDatum.id;
    this.getPortById(edgeDatum.source).edges.delete(edgeId);
    this.getPortById(edgeDatum.target).edges.delete(edgeId);
    this.edgeData.splice(edgeIdx, 1);
  }

  getNodeById(nodeId) {
    return this.nodeData.find(d => d.id === nodeId);
  }

  getEdgeById(edgeId) {
    return this.edgeData.find(d => d.id === edgeId);
  }

  getPortById(portId) {
    let p = Port.fromId(portId);
    let node = this.getNodeById(p.nodeId);
    return node[p.side][p.idx];
  }

  pruneEdges() {
    let ports = new Set();
    for (let node of this.nodeData) {
      for (let side of ['inputs', 'outputs']) {
        for (let port of node[side]) {
          ports.add(port.id);
        }
      }
    }
    this.edgeData = this.edgeData.filter(function(edge) {
      return ports.has(edge.source) && ports.has(edge.target);
    });
  }

  updatePorts() {
    let newNode = {inputs: [],  outputs: []};
    this.nodeData.forEach(function(node) {
      for (let side of ['inputs', 'outputs']) {
        for (let port of node[side]) {
          if (port.alias) {
            newNode[side].push({
              name: port.alias,
            });
          }
        }
      }
    });
    this.inputs = newNode.inputs;
    this.outputs = newNode.outputs;
  }

  updateAttributes() {
    let attributes = [];
    this.nodeData.forEach(function(node) {
      for (let attr of node.attributes) {
        if (attr.alias) {
          attributes.push({
            name: attr.alias,
            type: attr.type,
            value: attr.value
          });
        }
      }
    });
    this.attributes = attributes;
  }

  setPortAlias(port, alias) {
    port.alias = alias;
    this.updatePorts();
  }

  setAttributeAlias(attr, alias) {
    attr.alias = alias;
    this.updateAttributes();
  }
}

export default Node;
