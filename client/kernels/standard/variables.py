from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Variable(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Variable", "variable")
        config.add_output(core.Port(name="output"))
        config.add_attribute(core.Attribute(name="shape", type="array", value="0"))
        config.add_attribute(
            core.Attribute(name="dtype", type="string", value="float32"))
        return config

    def call(self):
        tf_dtypes = {
            "float32": tf.float32,
            "float64": tf.float64,
            "int32": tf.int32,
            "int64": tf.int64,
            "bool": tf.bool,
            "string": tf.string
        }
        output = tf.get_variable(
            "variable", shape=self.value, dtype=tf_dtypes[self.dtype])
        return dict(output=output)


@core.register_std_kernel
class Assign(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Assign", "assign")
        config.add_input(core.Port(name="variable"))
        config.add_input(core.Port(name="value"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, variable, value):
        output = tf.assign(variable, value)
        return dict(output=output)
