from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf

@core.register_std_kernel
class Run(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Run", "run")
        config.add_input(core.Port(name="inputs"))
        return config

    def call(self, inputs):
        for input_ in inputs:
            tf.add_to_collection(tf.GraphKeys.UPDATE_OPS, input_)
        return dict()
