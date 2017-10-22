from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections

_Port = collections.namedtuple(
    "Port", [
        "name"
    ]
)

class Port(_Port):
    def to_json(self):
        return dict(name=self.name)
