import pprint
import time

from kernels import core

class Graph(object):
    def __init__(self, data):
        pprint.pprint(data)

    def run(self):
        print("Updating graph")
        time.sleep(1)
