from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json
import time
import requests

def load_settings():
    fp = open("settings.json", "r")
    if not fp:
        raise RuntimeError('settings.json not found.')
    settings = json.load(fp)
    return settings


def get_commands(settings):
    response = requests.post(
        settings["api"] + "/cmd/list",
        json={
            "category": "query",
            "uid": settings["uid"]
        }
    )
    return response.json()


def listen(settings):
    while True:
        cmd = get_commands(settings)
        if cmd:
            print(time.time(), cmd)
        time.sleep(1)


def main():
    settings = load_settings()
    listen(settings)


if __name__ == "__main__":
    main()
