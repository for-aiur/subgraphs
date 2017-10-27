from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf


@core.register_std_kernel
class Dense(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Dense", "dense")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(core.Attribute(name="units", type="int", value="128"))
        return config

    def call(self, inputs):
        outputs = tf.layers.dense(inputs[0], self.units)
        return dict(outputs=outputs)


@core.register_std_kernel
class Conv2D(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Conv2D", "conv2d")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(core.Attribute(name="filters", type="int", value="128"))
        config.add_attribute(core.Attribute(name="kernel_size", type="int", value="3"))
        config.add_attribute(core.Attribute(name="strides", type="int", value="1"))
        return config

    def call(self, inputs):
        outputs = tf.layers.conv2d(
            inputs[0], self.filters, self.kernel_size, self.strides)
        return dict(outputs=outputs)


@core.register_std_kernel
class TransposedConv2D(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Transposed Conv2D", "tconv2d")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(core.Attribute(name="filters", type="int", value="128"))
        config.add_attribute(core.Attribute(name="kernel_size", type="int", value="3"))
        config.add_attribute(core.Attribute(name="strides", type="int", value="1"))
        return config

    def call(self, inputs):
        outputs = tf.layers.conv2d_transpose(
            inputs[0], self.filters, self.kernel_size, self.strides)
        return dict(outputs=outputs)
