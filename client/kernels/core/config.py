from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections

_Config = collections.namedtuple(
    "Config", [
        "title",
        "identifier",
        "inputs",
        "outputs",
        "attributes"
    ]
)

class Config(_Config):
    def __new__(cls, title, identifier):
        self = super(Config, cls).__new__(
            title=title,
            identifier=identifier,
            inputs=[],
            outputs=[],
            attributes=[]
        )
        return self

    def add_input(self, port):
        self.inputs.append(port)

    def add_output(self, port):
        self.outputs.append(port)

    def add_attribute(self, attribute):
        self.attributes.append(attribute)

    def to_json(self):
        return dict(
            title=self.title,
            identifier=self.identifier,
            category="kernel",
            inputs=[i.jo_json() for i in self.inputs],
            outputs=[i.jo_json() for i in self.outputs],
            attributes=[i.jo_json() for i in self.attributes],
        )
