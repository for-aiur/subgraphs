from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

_KERNELS = {}
_STANDARD_KERNELS = []
_CUSTOM_KERNELS = []


def register_std_kernel(cls):
    config = cls.get_config()
    _KERNELS[config.identifier] = cls
    _STANDARD_KERNELS.append(cls)
    return cls


def register_custom_kernel(cls):
    config = cls.get_config()
    _KERNELS[config.identifier] = cls
    _CUSTOM_KERNELS.append(cls)
    return cls


def get_kernels():
    return _KERNELS


def get_kernels_by_group(group):
    return {
        "custom": _CUSTOM_KERNELS,
        "standard": _STANDARD_KERNELS,
    }[group]


def get_kernel(identifier):
    if not identifier in _KERNELS:
        raise RuntimeError("Kernel {0} not found.".format(identifier))
    return _KERNELS[identifier]
