from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core

@core.register_kernel
class LabeledImage(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Labled image", "labeled_image")
        return config

    def call(self):
      print("Labeled image got called")
