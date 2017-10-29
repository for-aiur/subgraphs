from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import sys
from app import client


def main():
    try:
        cl = client.Client()
        args = set(sys.argv[1:])
        if "sync" in args:
            cl.sync("custom")
        if "sync-std" in args:
            cl.sync("standard")
        cl.listen()
    except Exception as e:
        print("Unhandled exception", e)


if __name__ == "__main__":
    main()
