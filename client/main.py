from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import time
import requests
import sys
import worker
from kernels import core


class App(object):

    def __init__(self):
        self.settings = self.load_settings()
        self.worker = worker.Worker(self.settings)

    def load_settings(self):
        fp = open("settings.json", "r")
        if not fp:
            raise RuntimeError("settings.json not found.")
        settings = json.load(fp)
        if not settings.get("uid") or not settings.get("authKey"):
            raise RuntimeError(
                "Please set your uid/authKey in settings.json. Login on subgraphs.com "
                "and click on reveal button on profile page to see your authKey.")
        return settings

    def sync(self, group):
        print("Synchronizing {0} kernels.".format(group))
        kernels = core.get_kernels_by_group(group)
        for kernel in kernels:
            data = kernel.get_config().to_json()
            data[u"public"] = group == "standard"
            response = requests.post(
                self.settings["api"] + "/doc/save",
                headers={
                    "uid": self.settings["uid"],
                    "authKey": self.settings["authKey"]
                },
                json=data
            )
            if response.ok:
                print("Registered {0}.".format(data["identifier"]))
            else:
                print("Failed to register {0}.".format(data["identifier"]))

    def fetch_commands(self):
        response = requests.post(
            self.settings["api"] + "/cmd/list",
            headers={
                "uid": self.settings["uid"],
                "authKey": self.settings["authKey"]
            },
            json={"category": "query"}
        )
        data = response.json()
        if not data:
            return

        for entry in data:
            name = entry["name"]
            content = entry["content"]
            self.worker.queue_cmd(name, content)


    def listen(self):
        while True:
            try:
                self.fetch_commands()
            except Exception as exception:
                raise RuntimeError("Failed to retrieve information from the server.")
            time.sleep(1)


def main():
    try:
        app = App()
        args = set(sys.argv[1:])
        if "sync" in args:
            app.sync("custom")
        if "sync-std" in args:
            app.sync("standard")
        app.listen()
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
