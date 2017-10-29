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
        config.add_input(core.Port(name="inputs"))
        return config

    def call(self, inputs):
        tf.summary.scalar("scalar", inputs[0])
        return dict()


@core.register_std_kernel
class HistogramSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Histogram Summary", "histogram_summary")
        config.add_input(core.Port(name="inputs"))
        return config

    def call(self, inputs):
        tf.summary.histogram("scalar", inputs[0])
        return dict()


@core.register_std_kernel
class ImageSummary(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Image Summary", "image_summary")
        config.add_input(core.Port(name="inputs"))
        return config

    def call(self, inputs):
        tf.summary.image("image", inputs[0])
        return dict()
