from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import kernels.core as core

@core.register_kernel
class Run(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("Run", "run")
        return config

    def call(self):
        print("Run got called.")
