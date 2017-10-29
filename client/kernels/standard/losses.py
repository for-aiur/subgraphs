from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class SoftmaxCrossEntropy(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Softmax Cross Entropy", "softmax_xe")
        config.add_input(core.Port(name="logits"))
        config.add_input(core.Port(name="labels"))
        config.add_output(core.Port(name="loss"))
        return config

    def call(self, logits, labels):
        if labels[0].dtype in [tf.int32, tf.int64]:
            loss = tf.losses.sparse_softmax_cross_entropy(
                labels=labels[0], logits=logits[0])
        else:
            loss = tf.losses.softmax_cross_entropy(
                onehot_labels=labels[0], logits=logits[0])
        return dict(loss=loss)


@core.register_std_kernel
class L2Loss(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("L2 loss", "l2_loss")
        config.add_input(core.Port(name="predictions"))
        config.add_input(core.Port(name="targets"))
        config.add_output(core.Port(name="loss"))
        return config

    def call(self, logits, labels):
        loss = tf.reduce_mean(tf.square(logits[0] - labels[0]))
        return dict(loss=loss)
