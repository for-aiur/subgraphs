from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf


@core.register_std_kernel
class Optimize(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Optimize", "optimize")
        config.add_input(core.Port(name="loss"))
        config.add_attribute(
            core.Attribute(name="learning_rate", type="int", value="0.001"))
        config.add_attribute(
            core.Attribute(name="method", type="string", value="adam"))
        return config

    def call(self, loss):
        global_step = tf.contrib.framework.get_or_create_global_step()
        outputs = tf.contrib.layers.optimize_loss(
            loss,
            global_step,
            self.learning_rate,
            self.method)
        return dict(outputs=outputs)
