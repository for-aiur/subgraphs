import json
import flask
from google.appengine.ext import ndb  # pylint: disable=E0401,E0611
from api import user
from storage.document import Document
from storage.user import User

APP = flask.Blueprint("doc", __name__)


@APP.route("/init", methods=["GET"])
def init_docs():
    usr = user.get_user()
    if not usr or not usr.isAdmin:
        flask.abort(403)
    query = Document.query(Document.public == True)
    keys = query.fetch(keys_only=True)
    ndb.delete_multi(keys)
    data = json.load(open("catalog.json"))
    docs = []
    for item in data:
        doc = Document()
        doc.owner = ndb.Key(User, usr.key.id())
        doc.title = item[u"title"]
        doc.identifier = item[u"identifier"]
        doc.category = item[u"category"]
        doc.public = True
        doc.content = json.dumps(item)
        docs.append(doc)
    ndb.put_multi(docs)
    return "Success.", 200


@APP.route("/list", methods=["POST"])
def list_docs():
    expression = Document.public == True
    uid = user.get_uid()
    if uid:
        expression = ndb.OR(
            Document.owner == ndb.Key(User, uid),
            expression)
    query = Document.query(expression)
    docs = query.fetch()
    docs = [json.loads(doc.content) for doc in docs]
    return flask.jsonify(docs)


@APP.route("/get", methods=["POST"])
def get_doc():
    data = flask.request.get_json()

    uid = user.get_uid()
    if not uid:
        uid = int(data.get(u"uid", 0))
        if not uid:
            flask.abort(403)

    identifier = data[u"identifier"]

    expression = ndb.AND(
        Document.identifier == identifier,
        ndb.OR(
            Document.owner == ndb.Key(User, uid),
            Document.public == True))

    doc = Document.query(expression).get()
    return flask.jsonify(json.loads(doc.content))


@APP.route("/save", methods=["POST"])
def save_doc():
    usr = user.get_user()
    if not usr:
        flask.abort(403)
    data = flask.request.get_json()

    identifier = data[u"identifier"]
    if not identifier:
        flask.abort(400)

    doc = Document.query(
        ndb.AND(Document.identifier == identifier,
                Document.owner == usr.key)).get()
    
    if not doc:
        doc = Document()
        doc.owner = ndb.Key(User, usr.key.id())

    doc.title = data[u"title"]
    doc.identifier = data[u"identifier"]
    doc.category = data[u"category"]
    doc.public = False
    doc.content = json.dumps(data)
    doc.put()
    return "Success.", 200


@APP.route("/delete", methods=["POST"])
def delete_doc():
    usr = user.get_user()
    if not usr:
        flask.abort(403)

    data = flask.request.get_json()

    identifier = data[u"identifier"]
    if not identifier:
        flask.abort(400)

    doc = Document.query(
        ndb.AND(Document.identifier == identifier,
                Document.owner == usr.key)).get()
    if not doc:
        flask.abort(400)

    if doc.owner.id() != usr.key.id():
        flask.abort(401)

    doc.key.delete()
    return "Success.", 200
