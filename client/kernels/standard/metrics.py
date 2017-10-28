from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf

@core.register_std_kernel
class Accuracy(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Accuracy", "accuracy")
        config.add_input(core.Port(name="labels"))
        config.add_input(core.Port(name="predictions"))
        config.add_output(core.Port(name="accuracy"))
        return config

    def call(self, labels, predictions):
        accuracy, _ = tf.metrics.accuracy(
            labels[0], predictions[0],
            updates_collections=tf.GraphKeys.UPDATE_OPS)
        return dict(accuracy=accuracy)
