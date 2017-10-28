from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import collections
import threading
import requests
from six.moves import queue
import graph

COMMANDS = {}


def register_command(func):
    COMMANDS[func.__name__] = func
    return func


class Worker(object):

    def __init__(self, settings):
        self.settings = settings
        self.graph = None
        self.queue = queue.Queue()
        self.status = "stop"
        self.thread = threading.Thread(target=self.start)
        self.thread.daemon = True
        self.thread.start()

    def queue_cmd(self, name, args):
        self.queue.put((name, args))

    @register_command
    def run(self, identifier):
        print("Running graph", identifier)
        self.status = "run"
        data = self.fetch_graph(identifier)
        self.graph = graph.Graph(data)

    @register_command
    def stop(self, identifier=None):
        del identifier
        print("Stopping execution")
        self.status = "stop"
        self.graph = None

    def start(self):
        while True:
            block = self.status == "stop"
            try:
                item = self.queue.get(block)
            except queue.Empty:
                self.update()
            else:
                name, args = item
                COMMANDS[name](self, **args)

    def join(self):
        self.thread.join()

    def fetch_graph(self, identifier):
        print("Fetching graph", identifier)
        self.graph = None
        response = requests.post(
            self.settings["api"] + "/doc/get",
            headers=dict(
                uid=self.settings["uid"],
                authKey=self.settings["authKey"]
            ),
            json=dict(identifier=identifier)
        )
        data = response.json(
            object_hook=lambda d: collections.namedtuple(
                'json', d.keys())(*d.values()))
        return data

    def update(self):
        if self.graph is None:
            self.stop()
            return
        try:
            self.graph.run()
        except Exception as e:
            self.stop()
            print("Unhandled exception", e)
