from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import re
import traceback
from six.moves import StringIO


def _colorize(text, color):
    control_sequence_introducer = "\x1B["
    return "{0}{1}m{2}{0}0m".format(control_sequence_introducer, color, text)


def pretty_print():
    exception_output = StringIO()
    traceback.print_exc(file=exception_output)
    stack_trace = exception_output.getvalue().splitlines()
    stack_trace.pop(0)
    error = stack_trace.pop()

    print("-" * 60)
    for i, line in enumerate(stack_trace):
        line = line.strip()
        if i % 2 == 0:
            matches = re.match(r'File "(.*)", line (\d+), in (.+)', line)
            if matches:
                groups = matches.groups()
                path = groups[0]
                path = path.replace(os.getcwd(), '')
                line_number = groups[1]
                method = groups[2]
        else:
            print("File {0}, line {1}, in {2}\n  {3}".format(
                _colorize(path, 36),
                _colorize(line_number, 33),
                _colorize(method, 32),
                line))
    print(_colorize("Error ", 33) + _colorize(error, 31))
    print("-" * 60)
