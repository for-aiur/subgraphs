from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class ReduceMean(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reduce Mean", "reduce_mean")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        config.add_attribute(
            core.Attribute(name="keep_dims", type="bool", value="false"))
        return config

    def call(self, input):
        axis = self.axis if self.axis else None
        output = tf.reduce_mean(input[0], axis, self.keep_dims)
        return dict(output=output)


@core.register_std_kernel
class ReduceSum(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reduce Sum", "reduce_sum")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        config.add_attribute(
            core.Attribute(name="keep_dims", type="bool", value="false"))
        return config

    def call(self, input):
        axis = self.axis if self.axis else None
        output = tf.reduce_sum(input[0], axis, self.keep_dims)
        return dict(output=output)


@core.register_std_kernel
class ReduceProd(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reduce Prod", "reduce_prod")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        config.add_attribute(
            core.Attribute(name="keep_dims", type="bool", value="false"))
        return config

    def call(self, input):
        axis = self.axis if self.axis else None
        output = tf.reduce_prod(input[0], axis, self.keep_dims)
        return dict(output=output)
