from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Cast(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Cast", "cast")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="dtype", type="string", value="float32"))
        return config

    def call(self, input):
        tf_dtypes = {
            "float32": tf.float32,
            "float64": tf.float64,
            "int32": tf.int32,
            "int64": tf.int64,
            "bool": tf.bool,
            "string": tf.string
        }
        output = tf.cast(input, tf_dtypes[self.dtype])
        return dict(output=output)
