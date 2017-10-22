from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections

_Attribute = collections.namedtuple(
    "Attribute", [
        "name",
        "type",
        "value"
    ]
)

class Attribute(_Attribute):

    def to_json(self):
        return dict(
            name=self.name,
            type=self.type,
            value=self.value
        )
