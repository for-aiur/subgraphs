from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import gzip
import struct
import numpy as np
from six.moves import urllib
import tensorflow as tf
from kernels import core

REMOTE_URL = "http://yann.lecun.com/exdb/mnist/"
LOCAL_DIR = "data/mnist/"
TRAIN_IMAGE_URL = "train-images-idx3-ubyte.gz"
TRAIN_LABEL_URL = "train-labels-idx1-ubyte.gz"
TEST_IMAGE_URL = "t10k-images-idx3-ubyte.gz"
TEST_LABEL_URL = "t10k-labels-idx1-ubyte.gz"
IMAGE_SIZE = 32
NUM_SHUFFLE_BATCHES = 10
NUM_THREADS = 8


@core.register_std_kernel
class CIFARDataset(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("MNIST Dataset", "mnist_dataset")
        config.add_output(core.Port(name="images"))
        config.add_output(core.Port(name="labels"))
        config.add_attribute(core.Attribute(name="split", type="string", value="train"))
        config.add_attribute(core.Attribute(name="batch_size", type="int", value="128"))
        config.add_attribute(core.Attribute(name="standardize", type="bool", value="false"))
        return config

    def __init__(self):
        # Download the mnist dataset.
        if not os.path.exists(LOCAL_DIR):
            os.makedirs(LOCAL_DIR)
        for name in [
            TRAIN_IMAGE_URL,
            TRAIN_LABEL_URL,
            TEST_IMAGE_URL,
            TEST_LABEL_URL]:
            if not os.path.exists(LOCAL_DIR + name):
                urllib.request.urlretrieve(REMOTE_URL + name, LOCAL_DIR + name)

    def call(self):
        image_urls = {
            "train": TRAIN_IMAGE_URL,
            "test": TEST_IMAGE_URL
        }[self.split]
        label_urls = {
            "train": TRAIN_LABEL_URL,
            "test": TEST_LABEL_URL
        }[self.split]

        with gzip.open(LOCAL_DIR + image_urls, "rb") as f:
            _, num, rows, cols = struct.unpack(">IIII", f.read(16))
            images = np.frombuffer(f.read(num * rows * cols), dtype=np.uint8)
            images = np.reshape(images, [num, rows, cols, 1])
            print("Loaded %d images of size [%d, %d]." % (num, rows, cols))

        with gzip.open(LOCAL_DIR + label_urls, "rb") as f:
            _, num = struct.unpack(">II", f.read(8))
            labels = np.frombuffer(f.read(num), dtype=np.int8).astype(np.int32)
            print("Loaded %d labels." % num)

        def _parse(image, label):
            image = tf.to_float(image)
            label = tf.to_int64(label)

            if self.standardize:
                image = tf.image.per_image_standardization(image)

            return image, label

        d = tf.contrib.data.Dataset.from_tensor_slices((images, labels))
        d = d.cache()
        if self.split == "train":
            d = d.repeat()
            d = d.shuffle(self.batch_size * NUM_SHUFFLE_BATCHES)
        d = d.map(_parse, num_threads=NUM_THREADS)
        d = d.batch(self.batch_size)
        it = d.make_one_shot_iterator()
        images, labels = it.get_next()

        return dict(images=images, labels=labels)
