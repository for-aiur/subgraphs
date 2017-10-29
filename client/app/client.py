from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import time
import requests
import six
from app import worker
from kernels import core


class Client(object):

    def __init__(self):
        self.print_logo()
        self.settings = self.load_settings()
        self.worker = worker.Worker(self.settings)

    def print_logo(self):
        print(r"   _____       _                           _          ")
        print(r"  / ____|     | |                         | |         ")
        print(r" | (___  _   _| |__   __ _ _ __ __ _ _ __ | |__  ___  ")
        print(r"  \___ \| | | | '_ \ / _` | '__/ _` | '_ \| '_ \/ __| ")
        print(r"  ____) | |_| | |_) | (_| | | | (_| | |_) | | | \__ \ ")
        print(r" |_____/ \__,_|_.__/ \__, |_|  \__,_| .__/|_| |_|___/ ")
        print(r"                      __/ |         | |               ")
        print(r"                     |___/          |_|               ")


    def load_settings(self):
        try: 
            settings = json.load(open("settings.json", "r"))
        except Exception:
            print("Setting up client for the first time.")
            print("You need to specify api, uid, and authKey to proceed. Login on "
                  "subgraphs.com and click on reveal button on profile page to see "
                  "your authKey.")
            api = six.moves.input(
                "API address (Defaults to: https://subgraphs.com/api): ")
            if not api:
                api = "https://subgraphs.com/api"
            uid = six.moves.input("UID: ")
            auth_key = six.moves.input("Authorization Key: ")
            settings = dict(
                api=api,
                uid=uid,
                authKey=auth_key)
            json.dump(settings, open("settings.json", "w"), indent=4)

        if (not settings.get("api") or
            not settings.get("uid") or
            not settings.get("authKey")):
            raise RuntimeError(
                "Please set your api, uid, and authKey in settings.json. Login on "
                "subgraphs.com and click on reveal button on profile page to see "
                "your authKey.")
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
