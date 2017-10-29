from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from kernels import core


@core.register_std_kernel
class ScalarSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Scalar Summary", "scalar_summary")
        config.add_input(core.Port(name="input"))
        return config

    def call(self, input):
        tf.summary.scalar("scalar", input[0])
        return dict()


@core.register_std_kernel
class HistogramSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Histogram Summary", "histogram_summary")
        config.add_input(core.Port(name="input"))
        return config

    def call(self, input):
        tf.summary.histogram("scalar", input[0])
        return dict()


@core.register_std_kernel
class ImageSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Image Summary", "image_summary")
        config.add_input(core.Port(name="input"))
        return config

    def call(self, input):
        tf.summary.image("image", input[0])
        return dict()


@core.register_std_kernel
class CollageSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Collage Summary", "collage_summary")
        config.add_input(core.Port(name="input"))
        config.add_attribute(core.Attribute(name="rows", type="int", value="8"))
        config.add_attribute(core.Attribute(name="cols", type="int", value="8"))
        config.add_attribute(core.Attribute(name="clip", type="bool", value="false"))
        return config

    def call(self, input):
        n = self.rows * self.cols
        images = input[0][:n]
        _, h, w, c = tf.unstack(tf.shape(images))
        images = tf.reshape(images, [self.rows, self.cols, h, w, c])
        images = tf.transpose(images, [0, 2, 1, 3, 4])
        images = tf.reshape(images, [1, self.rows * h, self.cols * w, c])
        if self.clip:
            images = tf.clip_by_value(images, 0, 255)
        tf.summary.image("image", images)
        return dict()
