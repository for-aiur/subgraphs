from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class Abs(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Abs", "abs")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.abs(input[0])
        return dict(output=output)

@core.register_std_kernel
class Add(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Add", "add")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.add(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Subtract(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Subtract", "subtract")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.subtract(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Multiply(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Multiply", "multiply")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.multiply(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Divide(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Divide", "divide")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.divide(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Minimum(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Minimum", "minimum")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.minimum(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Maximum(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Maximum", "maximum")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.maximum(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class Square(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Square", "square")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.square(input[0])
        return dict(output=output)


@core.register_std_kernel
class Sqrt(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Sqrt", "sqrt")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.sqrt(input[0])
        return dict(output=output)


@core.register_std_kernel
class Exp(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Exp", "exp")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.exp(input[0])
        return dict(output=output)


@core.register_std_kernel
class Log(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Log", "log")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, input):
        output = tf.log(input[0])
        return dict(output=output)


@core.register_std_kernel
class Power(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Power", "power")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.pow(x, y)
        return dict(output=output)


@core.register_std_kernel
class Matmul(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Matmul", "matmul")
        config.add_input(core.Port(name="x"))
        config.add_input(core.Port(name="y"))
        config.add_output(core.Port(name="output"))
        return config

    def call(self, x, y):
        output = tf.matmul(x[0], y[0])
        return dict(output=output)


@core.register_std_kernel
class ArgMax(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("ArgMax", "argmax")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        return config

    def call(self, input):
        output = tf.argmax(input[0], axis=self.axis)
        return dict(output=output)


@core.register_std_kernel
class ArgMin(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("ArgMin", "argmin")
        config.add_input(core.Port(name="input"))
        config.add_output(core.Port(name="output"))
        config.add_attribute(
            core.Attribute(name="axis", type="array", value="-1"))
        return config

    def call(self, input):
        output = tf.argmin(input[0], axis=self.axis)
        return dict(output=output)
