from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

_KERNELS = []
_CUSTOM_KERNELS = []


def register_kernel(cls):
    config = cls.get_config()
    old_init = cls.__init__
    def init(self):
        for attr in config.attributes:
            setattr(self, attr.name, attr.value)
        old_init(self)
    cls.__init__ = init
    _KERNELS.append(cls)
    return cls


def register_custom_kernel(cls):
    register_kernel(cls)
    _CUSTOM_KERNELS .append(cls)
    return cls


def get_kernels():
    return _KERNELS


def get_custom_kernels():
    return _CUSTOM_KERNELS
