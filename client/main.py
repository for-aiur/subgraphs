from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import time
import requests
import worker


class App(object):

    def __init__(self):
        self.settings = self.load_settings()
        self.worker = worker.Worker(self.settings)

    def load_settings(self):
        fp = open("settings.json", "r")
        if not fp:
            raise RuntimeError("settings.json not found.")
        settings = json.load(fp)
        if not int(settings.get("uid", 0)):
            raise RuntimeError(
                "Please set your UID in settings.json. Login on subgraphs.com and "
                "click on reveal button on profile page to see your UID.")
        return settings

    def fetch_commands(self):
        response = requests.post(
            self.settings["api"] + "/cmd/list",
            json={
                "category": "query",
                "uid": self.settings["uid"]
            }
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
        App().listen()
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
