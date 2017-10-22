import json
import flask
from google.appengine.ext import ndb  # pylint: disable=E0401,E0611
from api import user
from storage.command import Command
from storage.user import User

APP = flask.Blueprint("command", __name__)


@APP.route("/list", methods=["POST", "GET"])
def list_commands():
    data = flask.request.get_json()

    uid = user.get_uid()
    if not uid:
        print(uid)
        uid = int(data.get(u"uid", 0))
        if not uid:
            flask.abort(403)

    category = data[u"category"]
    if not category:
        flask.abort(400)

    query = Command.query(ndb.AND(
        Command.owner == ndb.Key(User, uid),
        Command.category == category))
    fetched = query.fetch()

    results = [{
        "name": result.name,
        "identifier": result.identifier,
        "date": result.date,
        "content": json.loads(result.content)
        } for result in fetched]

    if category == "query":
        keys = [item.key for item in fetched]
        ndb.delete_multi(keys)

    return flask.jsonify(results)


@APP.route("/save", methods=["POST"])
def save_command():
    data = flask.request.get_json()

    uid = user.get_uid()
    if not uid:
        uid = int(data.get(u"uid", 0))
        if not uid:
            flask.abort(403)

    identifier = data[u"identifier"]
    if not identifier:
        flask.abort(400)

    cmd = Command.query(
        ndb.AND(Command.identifier == identifier,
                Command.owner == ndb.Key(User, uid))).get()

    if not cmd:
        cmd = Command()
        cmd.owner = ndb.Key(User, uid)

    cmd.name = data[u"name"]
    cmd.identifier = data[u"identifier"]
    cmd.category = data[u"category"]
    cmd.content = json.dumps(data[u"content"])
    cmd.put()
    return "Success.", 200
