from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import abc


class Kernel(object):

    @staticmethod
    @abc.abstractmethod
    def get_config():
        return NotImplemented

    @abc.abstractmethod
    def call(self, **kwargs):
        return NotImplemented
