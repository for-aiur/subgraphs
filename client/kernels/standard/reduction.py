from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf


@core.register_std_kernel
class ReduceMean(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reduce Mean", "reduce_mean")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        config.add_attribute(
            core.Attribute(name="keep_dims", type="bool", value="false"))
        return config

    def call(self, inputs):
        axis = self.axis if self.axis else None
        outputs = tf.reduce_mean(inputs[0], axis, self.keep_dims)
        return dict(outputs=outputs)


@core.register_std_kernel
class ReduceSum(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reduce Sum", "reduce_sum")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        config.add_attribute(
            core.Attribute(name="keep_dims", type="bool", value="false"))
        return config

    def call(self, inputs):
        axis = self.axis if self.axis else None
        outputs = tf.reduce_sum(inputs[0], axis, self.keep_dims)
        return dict(outputs=outputs)
