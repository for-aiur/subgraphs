import React, { Component}  from 'react';
import d3 from '../../Common/D3Ext';
import * as Utils from '../../Common/Utils';
import Catalog from '../../Graph/Catalog';
import Node from '../../Graph/Node';
import Port from '../../Graph/Port';
import './Canvas.css';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.scope = new Node('Title', 'type');
    this.openNodes = [this.scope];
    this.catalog = new Catalog();
  }

  get nodeData() { return this.scope.nodeData; }
  get edgeData() { return this.scope.edgeData; }

  newSubgraph() {
    // Show a dialg to user and ask for the node name and type.
    this.scope = new Node('Title', 'type');
    this.openNodes.push(this.scope);  

    this.drawNodes();
    this.drawEdges();
    this.drawPropertiesView();
    this.drawTabs();
  }
  
  openSubgraph() {
    // Show a dialog with all the items in the catalog
    return true;
  }

  saveSubgraph() {
    // Show a dialog to confirm saving of the catalog
    return true;
  }

  groupSelection(selection) {
    let _self = this;

    // Create a new node
    let title = 'Template';
    let type = 'template';
    let name = this.scope.uniqueName(type);
    let newNode = new Node(title, type, name);

    // Create a set of node ids
    let nodeIds = new Set();
    selection.each(function(nodeDatum) {
      nodeIds.add(nodeDatum.id);
    });

    // Move nodes and edges
    let moveEdges = new Set();
    selection.each(function(nodeDatum) {
      newNode.nodeData.push(nodeDatum);

      newNode.position.x += nodeDatum.position.x;
      newNode.position.y += nodeDatum.position.y;

      // If there's no edge or there's an external connection create
      // new port, otherwise move all the edges to the new scope.
      for (let side of ['inputs', 'outputs']) {
        let st = {inputs: 'source', outputs: 'target'}[side];
        let ts = {inputs: 'target', outputs: 'source'}[side];
        for (let port of nodeDatum[side]) {
          let newPort = port.edges.size === 0;
          let rewireEdges = new Set();
          for (let edgeId of port.edges) {
            let edgeDatum = _self.scope.getEdgeById(edgeId);
            let srcNodeId = Port.fromId(edgeDatum[st]).nodeId;
            if (!nodeIds.has(srcNodeId)) {
              newPort = true;
              rewireEdges.add(edgeDatum);
            } else {
              moveEdges.add(edgeDatum);
            }
          }
          if (!newPort) continue;
          let l = newNode[side].length;
          let portId = new Port(newNode.id, side, l).id;
          newNode[side].push({
            name: port.name,
            id: portId,
            edges: new Set()
          });
          for (let edgeDatum of rewireEdges) {
            edgeDatum[ts] = portId;
          }
        }
      }
    });

    for (let edgeDatum of moveEdges) {
      let edgeIdx = _self.edgeData.indexOf(edgeDatum);
      _self.edgeData.splice(edgeIdx, 1);
      newNode.edgeData.push(edgeDatum);
    }

    newNode.position.x /= selection.size();
    newNode.position.y /= selection.size();

    this.nodeData.push(newNode);

    selection
    .each(function(d) {
      _self.scope.removeNode(d);
    });
    _self.drawNodes();
    _self.drawEdges();
  }

  createContextMenu(get_data) {
    let canvas = d3.select(this.canvas);
    let _self = this;
    let selectedDatum = null;

    let contextMenu = d3.select(this.contextMenu);

    let contextMenuEvent = function(d) {
      selectedDatum = d;
      d3.event.preventDefault();
      d3.event.stopPropagation();
      let mouse = d3.mouse(_self.canvas);
      contextMenu.attr('transform', function() {
        return 'translate(' + [ mouse[0], mouse[1] ] + ')'
      })

      let contextItem = contextMenu.selectAll('.contextItem')
      .data(get_data(selectedDatum));

      contextItem.exit().remove();

      let enter = contextItem
      .enter()
      .append('g')
      .attr('class', 'contextItem');

      enter
      .append('rect')
      .attr('y', (d, i) => 20 * i)
      .attr('width', 150)
      .attr('height', 20)
      .on('click', function(d) {
        d.callback(selectedDatum);
        selectedDatum = null;
      });

      enter
      .append('text')
      .attr('x', 8)
      .attr('y', (d, i) => 16 + 20 * i)
      .text(d => d.name);
    };

    canvas
    .on('click.hideNodeContext', function() {
      contextMenu.selectAll('.contextItem').remove();
    });

    return contextMenuEvent;
  }

  createNodeContextMenu() {
    let _self = this;
    this.nodeContextMenu = this.createContextMenu(function(d) {
      let items = [];

      if (d.nodeData.length > 0) {
        items.push({
          name: 'Open',
          callback: function() {
            _self.scope = _self.scope.getNodeById(d.id);
            if (!_self.openNodes.includes(_self.scope)) {
              _self.openNodes.push(_self.scope);
            }
            _self.drawNodes();
            _self.drawEdges();
            _self.drawTabs();
            _self.drawPropertiesView();
          },
        });

        items.push({
          name: 'Make reference',
          callback: function() {
            let mouse = d3.mouse(_self.nodesContainer);
            let pos = {x: mouse[0] - 75, y: mouse[1] - 20};
            let node = _self.scope.cloneChild(d, true);
            node.position = pos;
            _self.scope.addNode(node);
            _self.drawNodes();
          },
        });
      }

      items.push({
        name: 'Make copy',
        callback: function() {
          let mouse = d3.mouse(_self.nodesContainer);
          let pos = {x: mouse[0] - 75, y: mouse[1] - 20};
          let node = _self.scope.cloneChild(d, false);
          node.position = pos;
          _self.scope.addNode(node);
          _self.drawNodes();
        }
      });

      items.push({
        name: 'Remove',
        callback: function(selectedNodeDatum) {
          _self.scope.removeNode(selectedNodeDatum);
          _self.drawNodes();
          _self.drawEdges();
        }
      });

      let selection = d3.selectAll('.selected');
      if (selection.empty()) {
        return items;
      }

      items.push({
        name: 'Remove selected',
        callback: function() {
          selection
          .each(function(d) {
            _self.scope.removeNode(d);
          });
          _self.drawNodes();
          _self.drawEdges();
        },
      });

      items.push({
        name: 'Group selected',
        callback: function() {
          _self.groupSelection(selection);
        },
      });

      return items;
    });
  }

  createEdgeContextMenu() {
    let _self = this;
    let items = [
      {
        name: 'Remove',
        callback: function(selectedEdgeIdDatum) {
          _self.scope.removeEdge(selectedEdgeIdDatum);
          _self.drawEdges();
        },
      },
    ];

    this.edgeContextMenu = this.createContextMenu(function() {
      return items;
    });
  }

  createConnectHandler() {
    let _self = this;
    let line = d3.select(this.line);
    let sourceNode = null;
    let targetNode = null;

    this.edgeDrag = d3.drag()
    .on('start', function() {
      sourceNode = this;
      targetNode = null;
      let portPos = d3.select(this).position();
      line
      .attr('visibility', 'visible')
      .attr('x1', portPos.x)
      .attr('y1', portPos.y)
      .attr('x2', portPos.x)
      .attr('y2', portPos.y);
    })
    .on('drag', function() {
      let mouse = d3.mouse(_self.canvas);
      line
      .attr('x2', mouse[0])
      .attr('y2', mouse[1]);
    })
    .on('end', function() {
      line.attr('visibility', 'hidden');
      if (sourceNode != null && targetNode != null) {
        let src = null, tar = null;
        let ps = [sourceNode, targetNode];
        for (let p of ps) {
          let cls = d3.select(p.parentNode).attr('class');
          if (cls === 'nodeInput') {
            tar = p;
          } else if (cls === 'nodeOutput') {
            src = p;
          }
        }
        if (src != null && tar != null) {
          let srcId = d3.select(src).attr('id');
          let tarId = d3.select(tar).attr('id');
          _self.scope.addEdge(srcId, tarId);
          _self.drawEdges();
        }
      }
      sourceNode = targetNode = null;
    });

    this.portEnter = function() {
      if (sourceNode !== this) {
        targetNode = this;
      }
    };
  }

  createNodeDragHandler() {
    let _self = this;
    let shiftKey = false;

    d3.select('body')
    .on('keydown.click', function() { shiftKey = d3.event.shiftKey; })
    .on('keyup.click', function() {
      shiftKey = d3.event.shiftKey;
    });

    this.nodeDrag = d3.drag()
    .on('start', function() {
      if (!shiftKey) {
        d3.selectAll('.selected').classed('selected', false);
      }
      d3.select(this).classed('selected', true);
      _self.drawPropertiesView();
    })
    .on('drag', function(d) {
      d.position.x += d3.event.dx;
      d.position.y += d3.event.dy;
      d3.select(this).attr('transform', function(d){
        return 'translate(' + [ d.position.x, d.position.y ] + ')'
      })
      _self.drawEdges();
    })
    .on('end', function(d) {
      d.position.x = Math.round(d.position.x / 16) * 16;
      d.position.y = Math.round(d.position.y / 16) * 16;
      d3.select(this).attr('transform', function(d){
        return 'translate(' + [ d.position.x, d.position.y ] + ')'
      })
      _self.drawEdges();
    });
  }

  createPanAndSelectHandler() {
    let _self = this;
    let selectionRect = d3.select(this.selectionRect);
    let canvas = d3.select(this.canvas);
    let shiftKey = false;
    let translate = [0, 0];

    d3.select('body')
    .on('keydown.select', function() { shiftKey = d3.event.shiftKey; })
    .on('keyup.select', function() {
      shiftKey = d3.event.shiftKey;
      selectionRect
      .attr('visibility', 'hidden');
    });

    // Handle selection
    let mouseDown = false;
    let lastPos = [0, 0];
    let origin = [0, 0];
    canvas
    .on('mousedown.select', function() {
      if (d3.event.button !== 0) return;
      d3.event.preventDefault();
      mouseDown = true;
      origin = lastPos = d3.mouse(_self.canvas);
      if (shiftKey) {
        selectionRect
        .attr('visibility', 'visible')
        .attr('x', origin[0])
        .attr('y', origin[1])
        .attr('width', 0)
        .attr('height', 0);
      }
      d3.selectAll('.selected').classed('selected', false);
      _self.drawPropertiesView();
    })
    .on('mousemove.select', function() {
      if (!mouseDown) return;
      d3.event.preventDefault();
      let mouse = d3.mouse(_self.canvas);
      if (shiftKey) {
        selectionRect
        .attr('x', Math.min(origin[0], mouse[0]))
        .attr('y', Math.min(origin[1], mouse[1]))
        .attr('width', Math.abs(mouse[0] - origin[0]))
        .attr('height', Math.abs(mouse[1] - origin[1]));
      } else {
        translate[0] += mouse[0] - lastPos[0];
        translate[1] += mouse[1] - lastPos[1];
        let t = `translate(${translate[0]},${translate[1]})`;
        d3.select(_self.background).attr('transform', t);
        d3.select(_self.nodesContainer).attr('transform', t);
        _self.drawEdges();
      }
      lastPos = mouse;
    })
    .on('mouseup.select', function() {
      d3.event.preventDefault();
      mouseDown = false;
      if (shiftKey) {
        selectionRect
        .attr('visibility', 'hidden');

        let nodes = d3.select(_self.nodesContainer)
        .selectAll('.node');

        let box = {
          x1: Math.min(origin[0], lastPos[0]) - translate[0],
          y1: Math.min(origin[1], lastPos[1]) - translate[1],
          x2: Math.max(origin[0], lastPos[0]) - translate[0],
          y2: Math.max(origin[1], lastPos[1]) - translate[1]
        };

        let collide = function(node, x1, y1, x2, y2) {
          if (!node.length) {
            do {
              let d = node.data;
              let sel = (d.position.x > box.x1 &&
                     d.position.x < box.x2 &&
                     d.position.y > box.y1 &&
                     d.position.y < box.y2);
              if (sel) {
                d3.select('#' + d.id).classed('selected', true);
              }
              node = node.next;
            } while (node);
          }
          return (x1 > box.x2 || x2 < box.x1 ||
              y1 > box.y2 || y2 < box.y1);
        }

        let quadtree = d3.quadtree()
        .x(d => d.position.x)
        .y(d => d.position.y)
        .addAll(nodes.data(this.nodeData, d => d.id));

        nodes.each(function() {
          quadtree.visit(collide);
        });
        _self.drawPropertiesView();
      }
    });
  }

  clearHandlers() {
    delete this.nodeContextMenu;
    delete this.edgeContextMenu;
    delete this.edgeDrag;
    delete this.nodeDrag;
  }

  drawCatalog() {
    let _self = this;
    let catalogView = d3.select(this.catalogView);

    let drag = d3.drag()
    .on('start', function(d) {
      let draggingNode = d3.select(_self.draggingNode);
      draggingNode
      .append('a')
      .attr('class', 'list-group-item')
      .attr('role', 'button')
      .text(d.title);

      let mouse = d3.mouse(_self.container);
      let node = draggingNode.node();
      node.style.left = `${mouse[0]}px`;
      node.style.top = `${mouse[1]}px`;
    })
    .on('drag', function() {
      let mouse = d3.mouse(_self.container);
      let node = d3.select(_self.draggingNode).node();
      node.style.left = `${mouse[0]}px`;
      node.style.top = `${mouse[1]}px`;
    })
    .on('end', function(d) {
      d3.select(_self.draggingNode).selectAll('a').remove();
      let mouse = d3.mouse(_self.nodesContainer);
      if (mouse[0] > 0 && mouse[1] > 0) {
        let pos = {x: mouse[0] - 75, y: mouse[1] - 20};
        let node = _self.scope.fromTemplate(d, pos);
        _self.scope.addNode(node);
        _self.drawNodes();
      }
    });

    catalogView.selectAll('a')
    .data(this.catalog.commonItems)
    .enter()
    .append('a')
    .attr('class', 'list-group-item')
    .attr('role', 'button')
    .text(d => d.title)
    .call(drag);
  }

  drawPropertiesView() {
    let selection = d3.selectAll('.selected');

    let propertiesView = d3.select(this.propertiesView);
    propertiesView.selectAll('*').remove();

    if (selection.size() === 0) {
      let d = this.scope;
      
      let group = propertiesView.append('div')
      .attr('class', 'form-group');
      group.append('label').text('Title');
      group.append('input').attr('class', 'form-control').attr('value', d.title)
      .on('input', function() {
        d.name = this.value;
        d3.select(`#${d.id} > g > text`).text(this.value);
      });

      group = propertiesView.append('div')
      .attr('class', 'form-group');
      group.append('label').text('Type');
      group.append('input').attr('class', 'form-control').attr('value', d.type)
      .on('input', function() {
        d.name = this.value;
        d3.select(`#${d.id} > g > text`).text(this.value);
      });

      propertiesView.append('hr').attr('class', 'divider');

      for (let i in d.attributes) {
        let attribute = d.attributes[i];
        let group = propertiesView.append('div')
        .attr('class', 'form-group');;

        group.append('label').text(attribute.name);
        group.append('input')
        .attr('class', 'form-control')
        .attr('value', attribute.value)
        .on('input', function() {
          attribute.value = this.value;
          let p = d3.select(d3.selectAll(
            `#${d.id} .nodeAttr > text`).nodes()[i]);
          p.text(`${attribute.name}: ${this.value}`);
        });
      }
    } else if (selection.size() === 1) {
      let d = selection.datum();

      let group = propertiesView.append('div')
      .attr('class', 'form-group');
      group.append('label').text('Name');
      group.append('input').attr('class', 'form-control').attr('value', d.name)
      .on('input', function() {
        d.name = this.value;
        d3.select(`#${d.id} > g > text`).text(this.value);
      });

      propertiesView.append('hr').attr('class', 'divider');

      for (let i in d.attributes) {
        let attribute = d.attributes[i];
        let group = propertiesView.append('div')
        .attr('class', 'form-group');

        group.append('label').text(attribute.name);
        group.append('input')
        .attr('class', 'form-control')
        .attr('value', attribute.value)
        .on('input', function() {
          attribute.value = this.value;
          let p = d3.select(d3.selectAll(
            `#${d.id} .nodeAttr > text`).nodes()[i]);
          p.text(`${attribute.name}: ${this.value}`);
        });
      }
    }
  }

  drawTabs() {
    window.c = this;
    let elements = d3.select(this.tabsContainer);

    elements.selectAll('li').remove();

    for (let i in this.openNodes) {
      let p = this.openNodes[i];
      let item = elements.append('li')
      .attr('role', 'button')
      .on('click', function() {
        d3.event.stopPropagation();
        this.scope = p;
        this.drawNodes();
        this.drawEdges();
        this.drawTabs();
        this.drawPropertiesView();
      }.bind(this));

      if (this.scope === p) {
        item.attr('class', 'active');
      }

      item.append('span').text(p.type);

      item
      .append('a')
      .attr('role', 'button')
      .on('click', function() {
        d3.event.stopPropagation();
        if (!this.saveSubgraph()) {
          return;
        }
        this.openNodes.splice(i, 1);
        if (this.scope === p) {
          if (this.openNodes.length === 0) {
            this.newSubgraph();
            return;
          }
          this.scope = this.openNodes[Math.max(0, i - 1)];
          this.drawNodes();
          this.drawEdges();
        }
        this.drawTabs();
      }.bind(this))
      .append('i')
      .attr('class', 'fa fa-close');
    }
  }

  drawNodes() {
    let nodes = d3.select(this.nodesContainer)
    .selectAll('.node')
    .data(this.nodeData, d => d.id);

    nodes.exit().remove();

    let enter = nodes
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('id', d => d.id)
    .attr('transform', d => `translate(${d.position.x}, ${d.position.y})`)
    .call(this.nodeDrag)
    .on('contextmenu', this.nodeContextMenu);

    let nodeHeader = enter.append('g')
    .attr('class', 'nodeHeader');

    nodeHeader
    .append('rect')
    .attr('width', 150)
    .attr('height', 20);

    nodeHeader
    .append('text')
    .attr('x', 5)
    .attr('y', 16)
    .text(d => d.name);

    let nodeBody = enter.append('g')
    .attr('class', 'nodeBody')
    .attr('transform', 'translate(0, 20)');

    nodeBody
    .append('rect')
    .attr('width', 150)
    .attr('height', function(d) {
      let numPorts = Math.max(d.inputs.length, d.outputs.length);
      let numAttrs = d.attributes.length;
      return (numPorts + numAttrs) * 20
    });

    let nodeInputs = nodeBody
    .selectAll('.nodeInput')
    .data(d => d.inputs)
    .enter()
    .append('g')
    .attr('class', 'nodeInput');

    nodeInputs
    .append('circle')
    .attr('id', d => d.id)
    .attr('cx', 8)
    .attr('cy', (d, i) => 12 + 20 * i)
    .attr('r', 5)
    .text(d => d)
    .on('mouseenter', this.portEnter)
    .call(this.edgeDrag);

    nodeInputs
    .append('text')
    .attr('x', 16)
    .attr('y', (d, i) => 16 + 20 * i)
    .text(d => d.name);

    let nodeOutputs = nodeBody
    .selectAll('.nodeOutput')
    .data(d => d.outputs)
    .enter()
    .append('g')
    .attr('class', 'nodeOutput');

    nodeOutputs
    .append('circle')
    .attr('id', d => d.id)
    .attr('cx', 142)
    .attr('cy', (d, i) => 12 + 20 * i)
    .attr('r', 5)
    .on('mouseenter', this.portEnter)
    .call(this.edgeDrag);

    nodeOutputs
    .append('text')
    .attr('x', 134)
    .attr('y', (d, i) => 16 + 20 * i)
    .text(d => d.name);

    let nodeAttrs = nodeBody
    .selectAll('.nodeAttr')
    .data(d => {
      let numPorts = Math.max(d.inputs.length, d.outputs.length);
      let output = [];
      for (let i in d.attributes) {
        output.push({
          offset: 20 * (parseInt(i, 10) + numPorts),
          attr: d.attributes[i]
        });
      }
      return output;
    })
    .enter()
    .append('g')
    .attr('class', 'nodeAttr');

    nodeAttrs
    .append('rect')
    .attr('x', 0)
    .attr('y', d => d.offset)
    .attr('width', 150)
    .attr('height', 20)
    .text(d => d.name);

    nodeAttrs
    .append('text')
    .attr('x', 4)
    .attr('y', d => 16 + d.offset)
    .text(d => `${d.attr.name}: ${d.attr.value}`);
  }

  drawEdges() {
    let canvas = d3.select(this.edgesContainer);

    let edges = canvas
    .selectAll('.edge')
    .data(this.edgeData, d => d.id);

    edges.exit().remove();

    let enter = edges
    .enter()
    .append('g')
    .attr('class', 'edge');

    edges.merge(enter).attr('id', d => d.id);

    enter.append('path')
    .attr('class', 'edgePath');

    enter.append('circle')
    .attr('class', 'edgeCircle')
    .attr('fill', 'black')
    .attr('r', 1)
    .on('contextmenu', this.edgeContextMenu)
    .transition()
    .attr('r', 5);

    d3.selectAll('.edgePath')
    .attr('d', function(d) {
      let s = d3.select('#' + d.source).position();
      let t = d3.select('#' + d.target).position();
      let a = Utils.sigmoid(Math.abs(t.y - s.y));
      let c = {
        x: (s.x + t.x) / 2,
        y: (1 - a) * s.y + a * t.y
      };
      return `M${s.x},${s.y}S${c.x},${c.y},${t.x},${t.y}`;
    });

    d3.selectAll('.edgeCircle')
    .attr('transform', function(d) {
      let path = d3.select(`#${d.id} > path`).node();
      var l = path.getTotalLength();
      var pos = path.getPointAtLength(0.5 * l);
      return `translate(${pos.x},${pos.y})`;
    });
  }

  restart() {
    this.createNodeContextMenu();
    this.createEdgeContextMenu();

    this.createPanAndSelectHandler();
    this.createNodeDragHandler();
    this.createConnectHandler();

    this.drawCatalog();
    this.drawPropertiesView();
    this.drawTabs();
    this.drawNodes();
    this.drawEdges();
  }

  componentDidMount() {
    this.restart();
  }

  componentDidUpdate() {
    this.restart();
  }

  componentWillUnmount() {
    this.clearHandlers();
  }

  render() {
    return (
    <div id="container" ref={p => this.container = p} >
      <div id="catalogView">
        <div ref={p => this.catalogView = p} className="list-group">
        </div>
      </div>
      <div id="tabsContainer">
        <ul ref={p => this.tabsContainer = p} className="list-inline"></ul>
      </div>
      <div id="canvas">
      <svg ref={p => this.canvas = p}>
        <defs>
          <pattern id="grid" width="32" height="32"
              patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="2" fill="#ccc">
            </circle>
          </pattern>
          <marker id="arrow"
              markerWidth="7"
              markerHeight="7"
              refX="6" refY="2"
              orient="auto"
              markerUnits="strokeWidth">
            <path d="M0,0L0,4L7,2z" fill="#555"  />
          </marker>
        </defs>

        <g ref={p => this.background = p}>
          <rect ref={p => this.nodesContainer = p}
              className="wallpaper"
              x="-10000px" y="-10000px"
              width="20000px" height="20000px"
              fill="url(#grid)">
          </rect>
        </g>
        <g ref={p => this.edgesContainer = p}></g>
        <line ref={p => this.line = p}
            className="nodeLink"
            visibility="hidden"
            markerEnd="url(#arrow)">
        </line>
        <g ref={p => this.nodesContainer = p}></g>
        <rect ref={p => this.selectionRect = p} className="selectionRect"
            visibility="hidden">
        </rect>
        <g ref={p => this.contextMenu = p} className="contextMenu">
        </g>
      </svg>
      </div>
      <div id="propertiesView">
        <form ref={p => this.propertiesView = p}>
        </form>
      </div>
      <div id="overlay">
        <div ref={p => this.draggingNode = p} className="list-group">
        </div>
      </div>
    </div>
    )
  }
}

export default Canvas;
