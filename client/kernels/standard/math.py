from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core

@core.register_std_kernel
class Add(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Add", "add")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.add_n(inputs)
        return dict(outputs=outputs)


@core.register_std_kernel
class ArgMax(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("ArgMax", "argmax")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        return config

    def call(self, inputs):
        outputs = tf.argmax(inputs[0], axis=self.axis)
        return dict(outputs=outputs)
