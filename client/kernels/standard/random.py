from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf

@core.register_std_kernel
class RandomUniform(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Random Uniform", "random_uniform")
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="shape", type="array", value="[]"))
        config.add_attribute(
            core.Attribute(name="min", type="float", value="0"))
        config.add_attribute(
            core.Attribute(name="max", type="float", value="1"))
        return config

    def call(self):
        outputs = tf.random_uniform(self.shape, self.min, self.max)
        return dict(outputs=outputs)


@core.register_std_kernel
class RandomNormal(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Random Normal", "random_normal")
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="shape", type="array", value="[]"))
        config.add_attribute(
            core.Attribute(name="mean", type="float", value="0"))
        config.add_attribute(
            core.Attribute(name="stddev", type="float", value="1"))
        return config

    def call(self):
        outputs = tf.random_normal(self.shape, self.mean, self.stddev)
        return dict(outputs=outputs)
