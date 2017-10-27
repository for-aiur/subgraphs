from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf

@core.register_std_kernel
class Flatten(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Flatten", "flatten")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.contrib.layers.flatten(inputs)
        return dict(outputs=outputs)


@core.register_std_kernel
class Reshape(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Reshape", "reshape")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        config.add_attribute(
            core.Attribute(name="shape", type="array", value="[-1]"))
        return config

    def call(self, inputs):
        outputs = tf.reshape(inputs, self.shape)
        return dict(outputs=outputs)
