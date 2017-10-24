import pprint
import time

from kernels import core

class Graph(object):
    def __init__(self, data):
        for node in data[u"nodeData"]:
            print(node)

    def run(self):
        print("Updating graph")
        time.sleep(1)
