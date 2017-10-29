from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class ReLU(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("ReLU", "relu")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.nn.relu(input[0])
        return dict(output=output)


@core.register_std_kernel
class Softmax(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Softmax", "softmax")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.nn.softmax(input[0])
        return dict(output=output)


@core.register_std_kernel
class Sigmoid(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Sigmoid", "sigmoid")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.sigmoid(input[0])
        return dict(output=output)
