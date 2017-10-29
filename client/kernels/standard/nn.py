from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Dense(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Dense", "dense")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="units", type="int", value="128"))
        return config

    def call(self, input):
        output = tf.layers.dense(input[0], self.units)
        return dict(output=output)


@core.register_std_kernel
class Conv2D(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Conv2D", "conv2d")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="filters", type="int", value="128"))
        config.add_attribute(core.Attribute(name="kernel_size", type="int", value="3"))
        config.add_attribute(core.Attribute(name="strides", type="int", value="1"))
        return config

    def call(self, input):
        output = tf.layers.conv2d(
            input[0], self.filters, self.kernel_size, self.strides,
            padding="same")
        return dict(output=output)


@core.register_std_kernel
class TransposedConv2D(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Transposed Conv2D", "tconv2d")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="filters", type="int", value="128"))
        config.add_attribute(core.Attribute(name="kernel_size", type="int", value="3"))
        config.add_attribute(core.Attribute(name="strides", type="int", value="1"))
        return config

    def call(self, input):
        output = tf.layers.conv2d_transpose(
            input[0], self.filters, self.kernel_size, self.strides,
            padding="same")
        return dict(output=output)
