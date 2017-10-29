from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Equal(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Equal", "equal")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.equal(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Negative(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Negative", "negative")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.negative(input[0])
        return dict(output=output)
