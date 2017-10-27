from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import tarfile
import numpy as np
from six.moves import cPickle
from six.moves import urllib
import kernels.core as core
import tensorflow as tf

REMOTE_URL = "https://www.cs.toronto.edu/~kriz/cifar-100-python.tar.gz"
LOCAL_DIR = os.path.join("data/cifar100/")
ARCHIVE_NAME = "cifar-100-python.tar.gz"
DATA_DIR = "cifar-100-python/"
TRAIN_BATCHES = ["train"]
TEST_BATCHES = ["test"]
IMAGE_SIZE = 32
NUM_SHUFFLE_BATCHES = 10
NUM_THREADS = 8


@core.register_std_kernel
class CIFARDataset(core.Kernel):

    @staticmethod
    def get_config():
        config = core.Config("CIFAR100 Dataset", "cifar100_dataset")
        config.add_output(core.Port(name="images"))
        config.add_output(core.Port(name="labels"))
        config.add_attribute(core.Attribute(name="split", type="string", value="train"))
        config.add_attribute(core.Attribute(name="batch_size", type="int", value="128"))
        config.add_attribute(core.Attribute(name="random_crop", type="bool", value="false"))
        config.add_attribute(core.Attribute(name="standardize", type="bool", value="false"))
        return config

    def __init__(self):
        # Download the mnist dataset.
        if not os.path.exists(LOCAL_DIR):
            os.makedirs(LOCAL_DIR)
        if not os.path.exists(LOCAL_DIR + ARCHIVE_NAME):
            print("Downloading...")
            urllib.request.urlretrieve(REMOTE_URL, LOCAL_DIR + ARCHIVE_NAME)
        if not os.path.exists(LOCAL_DIR + DATA_DIR):
            print("Extracting files...")
            tar = tarfile.open(LOCAL_DIR + ARCHIVE_NAME)
            tar.extractall(LOCAL_DIR)
            tar.close()

    def call(self):
        batches = {
            "train": TRAIN_BATCHES,
            "eval": TEST_BATCHES
        }[self.split]

        all_images = []
        all_labels = []

        for batch in batches:
            with open("%s%s%s" % (LOCAL_DIR, DATA_DIR, batch), "rb") as fo:
                blob = cPickle.load(fo)
            images = np.array(blob["data"])
            labels = np.array(blob["fine_labels"])

            num = images.shape[0]
            images = np.reshape(images, [num, 3, IMAGE_SIZE, IMAGE_SIZE])
            images = np.transpose(images, [0, 2, 3, 1])
            print("Loaded %d examples." % num)

            all_images.append(images)
            all_labels.append(labels)

        all_images = np.concatenate(all_images)
        all_labels = np.concatenate(all_labels)

        def _parse(image, label):
            image = tf.to_float(image)
            image = tf.reshape(image, [IMAGE_SIZE, IMAGE_SIZE, 3])

            if self.random_crop:
                image = tf.image.resize_image_with_crop_or_pad(
                    image, IMAGE_SIZE + 4, IMAGE_SIZE + 4)
                image = tf.random_crop(image, [IMAGE_SIZE, IMAGE_SIZE, 3])
                image = tf.image.random_flip_left_right(image)

            if self.standardize:
                image = tf.image.per_image_standardization(image)

            return image, label

        d = tf.contrib.data.Dataset.from_tensor_slices(
            (all_images, all_labels))
        d = d.cache()
        if self.split == "train":
            d = d.repeat()
            d = d.shuffle(self.batch_size * NUM_SHUFFLE_BATCHES)
        d = d.map(_parse, num_threads=NUM_THREADS)
        d = d.batch(self.batch_size)
        it = d.make_one_shot_iterator()
        images, labels = it.get_next()

        return dict(images=images, labels=labels)
