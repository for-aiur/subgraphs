from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Constant(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Constant", "constant")
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="value", type="array", value="0"))
        return config

    def call(self):
        output = tf.constant(self.value)
        return dict(output=output)


@core.register_std_kernel
class Zeros(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Zeros", "zeros")
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="shape", type="array", value="[]"))
        return config

    def call(self):
        output = tf.zeros(self.shape)
        return dict(output=output)


@core.register_std_kernel
class Ones(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Ones", "ones")
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="shape", type="array", value="[]"))
        return config

    def call(self):
        output = tf.ones(self.shape)
        return dict(output=output)


@core.register_std_kernel
class Fill(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Fill", "fill")
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="value", type="float", value="0"))
        config.add_attribute(core.Attribute(name="shape", type="array", value="[]"))
        return config

    def call(self):
        output = tf.fill(self.shape, self.value)
        return dict(output=output)
