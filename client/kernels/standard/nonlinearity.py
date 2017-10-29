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
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.nn.relu(inputs[0])
        return dict(outputs=outputs)


@core.register_std_kernel
class Softmax(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Softmax", "softmax")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.nn.softmax(inputs[0])
        return dict(outputs=outputs)


@core.register_std_kernel
class Sigmoid(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Sigmoid", "sigmoid")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.sigmoid(inputs[0])
        return dict(outputs=outputs)
