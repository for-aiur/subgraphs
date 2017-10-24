from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf

@core.register_kernel
class Sum(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Sum", "sum")
        config.add_input(core.Port(name="inputs"))
        config.add_output(core.Port(name="outputs"))
        return config

    def call(self, inputs):
        outputs = tf.add_n(inputs)
        return dict(outputs=outputs)
