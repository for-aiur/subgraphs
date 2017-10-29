from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
from app import composition


class Graph(object):

    def __init__(self, data):
        tf.reset_default_graph()

        self._root = composition.Composition(data)
        self._outputs = self._root.call()
        self._summaries = tf.summary.merge_all()
        self._step = tf.contrib.framework.get_or_create_global_step()
        self._increment_step = tf.assign_add(self._step, 1)

        session_config = tf.ConfigProto()
        session_config.allow_soft_placement = True
        session_config.gpu_options.allow_growth = True

        self._session = tf.Session(config=session_config)
        self._session.run(tf.global_variables_initializer())
        self._session.run(tf.local_variables_initializer())
        self._session.run(tf.tables_initializer())

        identifier = data.identifier
        self._model_dir = "outputs/{0}/model".format(identifier)
        logdir = "outputs/{0}".format(identifier)

        if tf.trainable_variables():
            self._saver = tf.train.Saver()
        else:
            self._saver = None

        if self._summaries is not None:
            self._writer = tf.summary.FileWriter(
                logdir, graph=self._session.graph)
        else:
            self._writer = None

        self._i = 0

    def run(self):
        print("Updating graph")
        fetch = {"step": self._increment_step}
        if self._summaries is not None:
            fetch["summaries"] = self._summaries
        update_ops = tf.get_collection(tf.GraphKeys.UPDATE_OPS)
        if update_ops:
            fetch["updates"] = update_ops
        outputs = self._session.run(fetch)

        if self._i % 100 == 0:
            if self._saver:
                self._saver.save(
                    self._session, self._model_dir, outputs["step"])
            if self._writer:
                self._writer.add_summary(
                    outputs["summaries"], outputs["step"])

        self._i += 1
