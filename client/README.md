# Subgraphs client

Subgraphs client is a TensorFlow backend for [Subgraphs](https://subgraphs.com) editor. If you want to run the models developed in the editor, you need to have a client running to execute the commands.

## Installing dependencies
```
pip install six requests 
pip install --upgrade tensorflow-gpu
```
or
```
pip install tensorflow
```
in case you don't have a GPU installed.

## Quick start
```
git clone https://github.com/vahidk/subgraphs.git
cd subgraphs
python -m main
```

When you run the client for the first time you are asked to enter your user information:
```
API address (Defaults to: https://subgraphs.com/api): 
UID: ????
Authorization Key: ????
```
Press enter to use the default API address. To obtain your UID/Authorization Key login to https://subgraphs.com/ and find the requested information in profile page on the top right menu.

In another terminal window, launch TensorBoard to visualize the logs of your model:
```
tensorboard --logdir=outputs
```

You are all set.

Go to [Subgraphs editor](https://subgraphs.com/#/editor) to run your first model.

Note that if you have errors in your model, you'll need to refer to the terminal where you have the client running to find the error messages.
