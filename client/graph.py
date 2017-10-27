from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import tensorflow as tf
from kernels import core


class Composition(object):

    def __init__(self, data):
        self._data = data
        self._nodes = set()
        self._inputs = {}
        self._outputs = {}

    def call(self, **inputs):
        self._inputs = inputs

        # Create nodes that have at least one external output port
        for node in self._data.nodeData:
            is_external = False
            for port in node.outputs:
                if port.alias:
                    is_external = True
                    break

            if is_external:
                self.create_node(node)

        # Retrieve the output ports' values
        outputs = {}
        for node in self._data.nodeData:
            for port in node.outputs:
                if port.alias:
                    outputs[port.alias] = self._outputs[port.id]

        return outputs

    def create_node(self, node):
        if node.id in self._nodes:
            return
        self._nodes.add(node.id)

        if node.category == "kernel":
            # Create kernel
            new_node = core.get_kernel(node.identifier)()

            # Verify attributes
            config = new_node.get_config()
            config_names = set([attr.name for attr in config.attributes])
            node_names = set([attr.name for attr in node.attributes])
            if config_names != node_names:
                raise RuntimeError("Kernel attributes don't match.")
        elif node.category == "composition":
            new_node = Composition(node)
        else:
            raise RuntimeError("Unknown node category {0}.".format(node.category))

        # Set attributes
        for attr in node.attributes:
            value = attr.value
            # Inherit value from the parent if the attribute is external
            if attr.alias:
                for a in self._data.attributes:
                    if a.name == attr.alias:
                        value = a.value
            setattr(new_node, attr.name, self.convert_attr(value, attr.type))

        # Set inputs
        inputs = {}
        for in_port in node.inputs:
            inputs[in_port.name] = []
            for out_port, in_node in self.get_source_nodes(in_port.id).items():
                self.create_node(in_node)
                inputs[in_port.name].append(self._outputs[out_port])
            if in_port.alias:
                inputs[in_port.name].extend(self._inputs[in_port.alias])

        # Store outputs
        outputs = new_node.call(**inputs)
        ports = {output.name: output for output in node.outputs}
        for k, v in outputs.items():
            port = ports[k]
            self._outputs[port.id] = v

    def convert_attr(self, value, type):
        if type == "int":
            return int(value)
        if type == "bool":
            return value in ["True", "true"]
        if type == "float":
            return float(value)
        if type == "array":
            return json.loads(value)
        if type == "string":
            return value
        raise RuntimeError("Unknown type {0}".format(type))

    def get_source_nodes(self, in_port_id):
        sources = {}
        for edge in self._data.edgeData:
            if edge.target == in_port_id:
                node_id = edge.source.split('-')[0]
                sources[node_id] = edge.source
        args = {}
        for node in self._data.nodeData:
            source = sources.get(node.id)
            if not source:
                continue
            for p in node.outputs:
                if p.id == source:
                    args[p.id] = node
        return args


class Graph(object):

    def __init__(self, data):
        tf.reset_default_graph()
        self._root = Composition(data)
        self._outputs = self._root.call()

        session_config = tf.ConfigProto()
        session_config.allow_soft_placement = True
        session_config.gpu_options.allow_growth = True
        self._session = tf.Session(config=session_config)

    def run(self):
        print("Updating graph")
        self._session.run([self._outputs])
