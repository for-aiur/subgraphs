from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core
import tensorflow as tf


@core.register_std_kernel
class CrossEntropy(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Cross Entropy", "cross_entropy")
        config.add_input(core.Port(name="logits"))
        config.add_input(core.Port(name="labels"))
        config.add_output(core.Port(name="loss"))
        return config

    def call(self, logits, labels):
        if inputs.dtype in [tf.int32, tf.int64]:
            outputs = tf.losses.sparse_softmax_cross_entropy(
                labels=labels[0], logits=logits[0])
        else:
            outputs = tf.losses.softmax_cross_entropy(
                onehot_labels=labels[0], logits=logits[0])
        return dict(outputs=outputs)